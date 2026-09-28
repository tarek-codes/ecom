"use client";

import React, { useState } from "react";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatusAction } from "@/app/actions/admin-orders";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === status) return;
    setLoading(true);

    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) {
        setStatus(newStatus);
        setNotification({ type: "success", message: `Order status updated to ${newStatus}` });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: "error", message: res.error || "Failed to update status." });
      }
    } catch {
      setNotification({ type: "error", message: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {notification && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-4 rounded-xl border border-[#EADBCE]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#2D231E]">Current Status:</span>
          <StatusBadge status={status} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#6B5C52] shrink-0">
            Update Status:
          </label>
          <select
            disabled={loading}
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            className="px-3 py-1.5 rounded-lg border border-[#EADBCE] bg-white text-xs font-medium text-[#2D231E] focus:outline-none focus:border-[#B85D3B] disabled:opacity-50"
          >
            {Object.values(OrderStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
