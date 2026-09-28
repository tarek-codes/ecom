"use server";

import { prisma } from "@/lib/db/prisma";
import { STORE_CONFIG } from "@/lib/constants/config";
import { generateOrderNumber } from "@/lib/utils/format";
import { OrderStatus } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

export interface CheckoutFormInput {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  area: string;
  deliveryInstructions?: string;
  items: CheckoutItemInput[];
}

export interface CheckoutResult {
  success: boolean;
  orderNumber?: string;
  error?: string;
}

export async function createOrder(data: CheckoutFormInput): Promise<CheckoutResult> {
  try {
    // 1. Validate customer information
    if (!data.customerName || data.customerName.trim().length < 2) {
      return { success: false, error: "Please enter your full name." };
    }

    if (!data.phone || data.phone.trim().length < 7) {
      return { success: false, error: "Please enter a valid phone number for delivery updates." };
    }

    if (!data.address || data.address.trim().length < 5) {
      return { success: false, error: "Please provide a complete delivery street address." };
    }

    if (!data.city || data.city.trim().length < 2) {
      return { success: false, error: "Please enter your city." };
    }

    if (!data.area || data.area.trim().length < 2) {
      return { success: false, error: "Please specify your area/thana/neighborhood." };
    }

    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Your shopping cart is empty." };
    }

    // 2. Fetch fresh product data from PostgreSQL to validate stock & calculate prices
    const productIds = data.items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true, // Cannot purchase inactive products
      },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Check if any product is missing or inactive
    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return {
          success: false,
          error: "One or more items in your cart are no longer available. Please review your cart.",
        };
      }

      if (item.quantity <= 0) {
        return {
          success: false,
          error: `Invalid quantity for ${product.name}.`,
        };
      }

      if (product.stock < item.quantity) {
        if (product.stock === 0) {
          return {
            success: false,
            error: `"${product.name}" is currently out of stock.`,
          };
        }
        return {
          success: false,
          error: `Only ${product.stock} units are currently available for "${product.name}".`,
        };
      }
    }

    // 3. Compute subtotal, delivery fee, and grand total strictly on server
    let computedSubtotal = 0;
    const orderItemsData: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }> = [];

    for (const item of data.items) {
      const product = productMap.get(item.productId)!;
      const unitPrice = Number(product.price);
      const lineSubtotal = unitPrice * item.quantity;
      computedSubtotal += lineSubtotal;

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: unitPrice,
        subtotal: lineSubtotal,
      });
    }

    const deliveryFee = STORE_CONFIG.defaultDeliveryFee;
    const grandTotal = computedSubtotal + deliveryFee;

    // Generate unique human-readable order number
    let orderNumber = generateOrderNumber();
    // Ensure uniqueness
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.order.findUnique({ where: { orderNumber } });
      if (!existing) break;
      orderNumber = generateOrderNumber();
      attempts++;
    }

    // 4. Execute atomic transaction: create Order, OrderItems, and decrease Product stock
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Re-verify stock inside transaction and decrement
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true, stock: true, name: true, isActive: true },
        });

        if (!product || !product.isActive) {
          throw new Error("One or more products became unavailable.");
        }

        if (product.stock < item.quantity) {
          throw new Error(`Only ${product.stock} units are currently available for "${product.name}".`);
        }

        // Decrement stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create Order and items
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: data.customerName.trim(),
          phone: data.phone.trim(),
          email: data.email?.trim() || null,
          address: data.address.trim(),
          city: data.city.trim(),
          area: data.area.trim(),
          deliveryInstructions: data.deliveryInstructions?.trim() || null,
          subtotal: computedSubtotal,
          deliveryFee: deliveryFee,
          total: grandTotal,
          paymentMethod: "Cash on Delivery",
          status: OrderStatus.Pending,
          items: {
            create: orderItemsData.map((oi) => ({
              productId: oi.productId,
              productName: oi.productName,
              quantity: oi.quantity,
              unitPrice: oi.unitPrice,
              subtotal: oi.subtotal,
            })),
          },
        },
      });

      return newOrder;
    });

    // Invalidate product cache so updated stock reflects immediately across store
    updateTag("products");
    revalidatePath("/shop");
    revalidatePath("/");

    return {
      success: true,
      orderNumber: createdOrder.orderNumber,
    };
  } catch (err: unknown) {
    console.error("Order creation transaction error:", err);
    const message = err instanceof Error ? err.message : "Failed to place order. Please try again.";
    return {
      success: false,
      error: message,
    };
  }
}
