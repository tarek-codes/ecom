import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    stock: product.stock,
    categoryId: product.categoryId,
    mainImage: product.mainImage,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    additionalImages: product.images.map((img) => img.imageUrl),
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title={`Edit "${product.name}"`}
        description="Update pricing, stock availability, photos, or description."
      />

      <div className="px-6">
        <ProductForm
          initialData={initialData}
          categories={categories}
          isEditing={true}
        />
      </div>
    </div>
  );
}
