import React from "react";
import { prisma } from "@/lib/db/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoryManager, CategoryRow } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const dbCategories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  const categories: CategoryRow[] = dbCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    isActive: c.isActive,
    _count: {
      products: c._count.products,
    },
  }));

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Category Management"
        description="Organize your store collections (Resin, Paper, Keychains, Decor, Gifts)."
      />

      <div className="px-6">
        <CategoryManager initialCategories={categories} />
      </div>
    </div>
  );
}
