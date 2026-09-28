import React from "react";
import { ORDER_STATUS_LABELS } from "@/lib/constants/config";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = ORDER_STATUS_LABELS[status] || {
    label: status,
    color: "text-stone-700",
    bg: "bg-stone-100 border-stone-200",
  };

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses} ${config.bg} ${config.color}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {config.label}
    </span>
  );
}
