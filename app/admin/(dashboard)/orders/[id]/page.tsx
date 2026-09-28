import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";
import { formatPrice, formatDate } from "@/lib/utils/format";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  Banknote,
} from "lucide-react";

interface AdminOrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              mainImage: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title={`Order #${order.orderNumber}`}
        description={`Placed on ${formatDate(order.createdAt)} via Cash on Delivery.`}
        actions={
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EADBCE] text-xs font-medium text-[#2D231E] hover:bg-[#F3ECE2] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders</span>
          </Link>
        }
      />

      <div className="px-6 space-y-6 max-w-5xl">
        {/* Status update widget */}
        <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 shadow-xs">
          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
          />
        </div>

        {/* Customer & Shipping destination cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#2D231E] border-b border-[#F3ECE2] pb-3">
              Customer Information
            </h3>
            <div className="space-y-2 text-xs text-[#6B5C52]">
              <div>
                <span className="font-semibold text-[#2D231E] block text-sm">
                  {order.customerName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B85D3B]" />
                <span className="text-[#2D231E] font-medium">{order.phone}</span>
              </div>
              {order.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{order.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 pt-1">
                <Banknote className="w-3.5 h-3.5 text-[#556B59]" />
                <span className="text-[#556B59] font-medium">Payment: Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#2D231E] border-b border-[#F3ECE2] pb-3">
              Delivery Destination
            </h3>
            <div className="space-y-2 text-xs text-[#6B5C52]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B85D3B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#2D231E] font-medium">{order.address}</p>
                  <p>{order.area}, {order.city}</p>
                </div>
              </div>
              {order.deliveryInstructions && (
                <div className="mt-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#EADBCE]">
                  <span className="font-semibold text-[#2D231E] block mb-0.5">
                    Customer Instructions:
                  </span>
                  <p className="italic text-[#6B5C52]">&ldquo;{order.deliveryInstructions}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ordered items breakdown */}
        <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-medium text-[#2D231E] border-b border-[#F3ECE2] pb-3">
            Ordered Items ({order.items.length})
          </h3>

          <div className="divide-y divide-[#F3ECE2]">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#EADBCE] flex items-center justify-center text-[#B85D3B]">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2D231E] text-sm">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-[#8A7B70]">
                      Quantity: {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                </div>

                <div className="text-right font-serif font-semibold text-sm text-[#2D231E]">
                  {formatPrice(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-[#EADBCE] space-y-2 text-xs text-[#6B5C52] max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-medium text-[#2D231E]">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-medium text-[#2D231E]">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#EADBCE] text-base">
              <span className="font-serif font-medium text-[#2D231E]">Grand Total</span>
              <span className="font-serif font-bold text-[#B85D3B]">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
