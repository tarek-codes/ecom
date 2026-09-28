import React from "react";
import { prisma } from "@/lib/db/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Add New Handcrafted Product"
        description="Enter product details, pricing, botanicals description, and stock quantity."
      />

      <div className="px-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
