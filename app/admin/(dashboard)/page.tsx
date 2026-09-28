import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice } from "@/lib/utils/format";
import {
  Package,
  AlertTriangle,
  ShoppingBag,
  Clock,
  CheckCheck,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Concurrently query all statistics from PostgreSQL
  const [
    totalProducts,
    activeProducts,
    outOfStockProducts,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    revenueAggregate,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { stock: { lte: 0 } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.Pending } }),
    prisma.order.count({ where: { status: OrderStatus.Delivered } }),
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          not: OrderStatus.Cancelled,
        },
      },
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    }),
  ]);

  const totalRevenue = Number(revenueAggregate._sum.total || 0);

  const statsCards = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      subtext: "Excluding cancelled orders",
      icon: TrendingUp,
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      subtext: `${pendingOrders} pending action`,
      icon: ShoppingBag,
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-200",
    },
    {
      label: "Pending Orders",
      value: pendingOrders.toString(),
      subtext: "Requires confirmation / dispatch",
      icon: Clock,
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
    },
    {
      label: "Delivered Orders",
      value: deliveredOrders.toString(),
      subtext: "Successfully completed",
      icon: CheckCheck,
      color: "text-indigo-700",
      bg: "bg-indigo-50 border-indigo-200",
    },
    {
      label: "Active Crafts",
      value: activeProducts.toString(),
      subtext: `Out of ${totalProducts} total catalog`,
      icon: Package,
      color: "text-[#B85D3B]",
      bg: "bg-[#F3ECE2] border-[#EADBCE]",
    },
    {
      label: "Out of Stock",
      value: outOfStockProducts.toString(),
      subtext: "Requires restocking in studio",
      icon: AlertTriangle,
      color: outOfStockProducts > 0 ? "text-rose-700" : "text-stone-600",
      bg: outOfStockProducts > 0 ? "bg-rose-50 border-rose-200" : "bg-stone-50 border-stone-200",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Dashboard Overview"
        description="Real-time business performance and incoming order pipeline from PostgreSQL."
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B85D3B] hover:bg-[#9E4B2C] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        }
      />

      <div className="px-6 space-y-8">
        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statsCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#EADBCE] p-6 shadow-xs flex items-start justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-[#8A7B70] uppercase tracking-wider block">
                    {card.label}
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2D231E] mt-1.5">
                    {card.value}
                  </div>
                  <p className="text-[11px] text-[#6B5C52] mt-1">
                    {card.subtext}
                  </p>
                </div>
                <div className={`p-3 rounded-xl border ${card.bg} ${card.color} shrink-0`}>
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl border border-[#EADBCE] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#F3ECE2] flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-medium text-[#2D231E]">
                Recent Orders
              </h2>
              <p className="text-xs text-[#8A7B70] mt-0.5">
                Most recent Cash on Delivery orders placed by customers
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B85D3B] hover:text-[#9E4B2C]"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8A7B70]">
              No orders have been placed yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2D231E]">
                <thead className="bg-[#FAF7F2] text-[#8A7B70] uppercase tracking-wider font-semibold border-b border-[#EADBCE]">
                  <tr>
                    <th className="py-3.5 px-6">Order ID</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Location</th>
                    <th className="py-3.5 px-6">Items</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3ECE2]">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-4 px-6 font-mono font-medium text-[#B85D3B]">
                        #{order.orderNumber}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-[#2D231E]">{order.customerName}</div>
                        <div className="text-[11px] text-[#8A7B70]">{order.phone}</div>
                      </td>
                      <td className="py-4 px-6 text-[#6B5C52]">
                        {order.area}, {order.city}
                      </td>
                      <td className="py-4 px-6 text-[#6B5C52]">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </td>
                      <td className="py-4 px-6 font-serif font-semibold text-[#2D231E]">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="px-3 py-1.5 rounded-lg border border-[#EADBCE] text-xs font-medium text-[#2D231E] hover:bg-[#F3ECE2] transition-colors inline-block"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
