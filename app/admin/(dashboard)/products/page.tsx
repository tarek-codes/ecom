import React from "react";
import { prisma } from "@/lib/db/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminProductsTable, AdminProductRow } from "@/components/admin/AdminProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [dbProducts, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const products: AdminProductRow[] = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    stock: p.stock,
    mainImage: p.mainImage,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    category: {
      id: p.category.id,
      name: p.category.name,
    },
  }));

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Products & Inventory"
        description="Manage handcrafted catalog, stock availability, pricing, and visibility."
      />

      <div className="px-6">
        <AdminProductsTable
          initialProducts={products}
          categories={categories}
        />
      </div>
    </div>
  );
}
