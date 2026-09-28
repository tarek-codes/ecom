"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Eye, Filter } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OrderStatus } from "@prisma/client";

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  area: string;
  total: number;
  itemCount: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

export function AdminOrdersTable({ initialOrders }: { initialOrders: AdminOrderRow[] }) {
  const [orders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-[#EADBCE] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs text-[#8A7B70] flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Status:</span>
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs font-medium text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
          >
            <option value="all">All Orders ({orders.length})</option>
            {Object.values(OrderStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#EADBCE] shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8A7B70]">
            No orders match the selected search or status criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2D231E]">
              <thead className="bg-[#FAF7F2] text-[#8A7B70] uppercase tracking-wider font-semibold border-b border-[#EADBCE]">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Destination</th>
                  <th className="py-3.5 px-6">Items</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Payment</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Order Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3ECE2]">
                {filteredOrders.map((order) => (
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
                      {order.itemCount} items
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#2D231E]">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-4 px-6 text-[#556B59] font-medium">
                      Cash on Delivery
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="py-4 px-6 text-[#8A7B70] whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EADBCE] text-xs font-medium text-[#2D231E] hover:bg-[#F3ECE2] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
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
  );
}
