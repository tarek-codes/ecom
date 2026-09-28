"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { slugify } from "@/lib/utils/format";
import { revalidatePath } from "next/cache";

export interface ProductFormData {
  name: string;
  slug?: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  mainImage: string;
  additionalImages?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
}

export async function createProductAction(data: ProductFormData) {
  await requireAdmin();

  if (!data.name || !data.categoryId || data.price <= 0 || !data.mainImage) {
    return { success: false, error: "Please fill in all required fields properly." };
  }

  try {
    let slug = data.slug ? slugify(data.slug) : slugify(data.name);
    // Ensure slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        name: data.name.trim(),
        slug,
        description: data.description.trim(),
        price: data.price,
        stock: Math.max(0, data.stock),
        categoryId: data.categoryId,
        mainImage: data.mainImage.trim(),
        isFeatured: !!data.isFeatured,
        isActive: data.isActive !== undefined ? data.isActive : true,
        images: {
          create: (data.additionalImages || [])
            .filter((url) => !!url && url.trim().length > 0)
            .map((url, idx) => ({
              imageUrl: url.trim(),
              sortOrder: idx + 1,
            })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");

    return { success: true, product };
  } catch (error: unknown) {
    console.error("Create product error:", error);
    const msg = error instanceof Error ? error.message : "Failed to create product.";
    return { success: false, error: msg };
  }
}

export async function updateProductAction(id: string, data: ProductFormData) {
  await requireAdmin();

  if (!data.name || !data.categoryId || data.price <= 0 || !data.mainImage) {
    return { success: false, error: "Please fill in all required fields properly." };
  }

  try {
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    await prisma.product.update({
      where: { id },
      data: {
        name: data.name.trim(),
        slug,
        description: data.description.trim(),
        price: data.price,
        stock: Math.max(0, data.stock),
        categoryId: data.categoryId,
        mainImage: data.mainImage.trim(),
        isFeatured: !!data.isFeatured,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    // Update additional images
    if (data.additionalImages) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      const validImages = data.additionalImages.filter((u) => !!u && u.trim().length > 0);
      if (validImages.length > 0) {
        await prisma.productImage.createMany({
          data: validImages.map((url, idx) => ({
            productId: id,
            imageUrl: url.trim(),
            sortOrder: idx + 1,
          })),
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/products/${slug}`);
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error: unknown) {
    console.error("Update product error:", error);
    const msg = error instanceof Error ? error.message : "Failed to update product.";
    return { success: false, error: msg };
  }
}

export async function toggleProductActiveAction(id: string, isActive: boolean) {
  await requireAdmin();

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/products/${updated.slug}`);
    revalidatePath("/admin/products");

    return { success: true, isActive: updated.isActive };
  } catch (error) {
    console.error("Toggle product status error:", error);
    return { success: false, error: "Failed to update product visibility." };
  }
}

export async function deleteProductAction(id: string) {
  await requireAdmin();

  try {
    // Check if product is in any orders
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
      // Soft-delete to preserve order history
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/admin/products");
      return {
        success: true,
        message: "Product is referenced by existing orders, so it was set to Inactive to preserve sales history.",
      };
    }

    // Otherwise safe to hard delete
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");
    return { success: true, message: "Product deleted successfully." };
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false, error: "Failed to delete product." };
  }
}
