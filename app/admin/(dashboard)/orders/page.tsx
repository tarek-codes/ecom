import React from "react";
import { prisma } from "@/lib/db/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOrdersTable, AdminOrderRow } from "@/components/admin/AdminOrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const dbOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  const orders: AdminOrderRow[] = dbOrders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    phone: o.phone,
    city: o.city,
    area: o.area,
    total: Number(o.total),
    itemCount: o.items.reduce((sum, item) => sum + item.quantity, 0),
    paymentMethod: o.paymentMethod,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Orders & Shipments"
        description="Monitor customer orders, delivery locations, and update fulfillment statuses."
      />

      <div className="px-6">
        <AdminOrdersTable initialOrders={orders} />
      </div>
    </div>
  );
}
