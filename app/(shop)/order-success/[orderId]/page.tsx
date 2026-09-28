import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CheckCircle2, ArrowRight, Truck, Package, Banknote, MapPin, Phone, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Received | Resin & Paper Craft",
  description: "Thank you for your order! Your handmade order has been received.",
};

interface OrderSuccessPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;

  // Search by either human-readable orderNumber or cuid id
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ orderNumber: orderId }, { id: orderId }],
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Success Banner */}
      <div className="text-center space-y-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-10 h-10 stroke-[2]" />
        </div>
        <span className="text-xs uppercase tracking-widest font-semibold text-[#556B59] block">
          Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#2D231E]">
          Thank you for your order!
        </h1>
        <p className="text-sm text-[#6B5C52] max-w-md mx-auto leading-relaxed">
          Your order <strong className="text-[#2D231E]">#{order.orderNumber}</strong> has been received and is being carefully prepared in our studio.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EADBCE] shadow-xs overflow-hidden mb-8">
        {/* Header Ribbon */}
        <div className="bg-[#FAF7F2] p-6 border-b border-[#EADBCE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-xl font-medium text-[#2D231E]">
                Order #{order.orderNumber}
              </h2>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-[#8A7B70] mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#EADBCE] text-xs font-medium text-[#556B59] self-start sm:self-auto">
            <Banknote className="w-4 h-4 text-[#B85D3B]" />
            <span>Payment: Cash on Delivery</span>
          </div>
        </div>

        {/* Customer & Delivery Information */}
        <div className="p-6 border-b border-[#F3ECE2] grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <h3 className="font-semibold uppercase tracking-wider text-[#8A7B70]">
              Customer Details
            </h3>
            <p className="text-sm font-medium text-[#2D231E]">{order.customerName}</p>
            <p className="text-[#6B5C52] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>{order.phone}</span>
            </p>
            {order.email && (
              <p className="text-[#6B5C52] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>{order.email}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold uppercase tracking-wider text-[#8A7B70]">
              Delivery Destination
            </h3>
            <div className="text-[#6B5C52] flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[#2D231E]">{order.address}</p>
                <p>{order.area}, {order.city}</p>
              </div>
            </div>
            {order.deliveryInstructions && (
              <p className="text-[11px] text-stone-500 italic mt-1 bg-[#FAF7F2] p-2 rounded">
                Note: &ldquo;{order.deliveryInstructions}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="p-6">
          <h3 className="font-serif text-lg font-medium text-[#2D231E] mb-4">
            Ordered Handmade Pieces
          </h3>

          <div className="divide-y divide-[#F3ECE2]">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F3ECE2] text-[#B85D3B] flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2D231E]">{item.productName}</h4>
                    <p className="text-[11px] text-[#8A7B70]">
                      Quantity: {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-[#2D231E]">
                  {formatPrice(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="mt-6 pt-4 border-t border-[#EADBCE] space-y-2 text-xs text-[#6B5C52]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-medium text-[#2D231E]">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#B85D3B]" />
                <span>Delivery Charge</span>
              </span>
              <span className="font-medium text-[#2D231E]">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#EADBCE] text-base">
              <span className="font-serif font-medium text-[#2D231E]">Total Payable (Cash)</span>
              <span className="font-serif font-bold text-[#B85D3B]">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/shop"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#B85D3B] text-white text-sm font-medium hover:bg-[#9E4B2C] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#EADBCE] bg-white text-[#2D231E] text-sm font-medium hover:bg-[#FAF7F2] transition-colors text-center"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
