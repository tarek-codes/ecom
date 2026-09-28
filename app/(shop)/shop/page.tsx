import React from "react";
import { prisma } from "@/lib/db/prisma";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopFilterBar } from "@/components/shop/ShopFilterBar";
import { SerializedProduct } from "@/components/shop/ProductCard";
import { Prisma } from "@prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Handmade Crafts & Botanicals",
  description:
    "Explore our complete collection of handmade resin jewelry, pressed flower bookmarks, paper floral bouquets, and bespoke artisan gifts.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, search, sort = "newest" } = await searchParams;

  // Build Prisma where query
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (category) {
    where.category = {
      slug: category,
    };
  }

  if (search && search.trim().length > 0) {
    where.OR = [
      { name: { contains: search.trim(), mode: "insensitive" } },
      { description: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  // Build Prisma orderBy query
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price-desc") {
    orderBy = { price: "desc" };
  } else if (sort === "name-asc") {
    orderBy = { name: "asc" };
  }

  // Fetch products and active categories concurrently
  const [dbProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const products: SerializedProduct[] = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    stock: p.stock,
    mainImage: p.mainImage,
    isFeatured: p.isFeatured,
    category: {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug,
    },
  }));

  // Selected category info for title
  const activeCategory = category ? categories.find((c) => c.slug === category) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B85D3B] block mb-1">
          Artisanal Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#2D231E]">
          {activeCategory ? activeCategory.name : "All Handmade Crafts"}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5C52] mt-1.5">
          Showing {products.length} {products.length === 1 ? "creation" : "creations"}
          {search ? ` matching "${search}"` : ""}
          {activeCategory ? ` in ${activeCategory.name}` : ""}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <React.Suspense fallback={<div className="h-16 bg-white rounded-2xl border border-[#EADBCE] animate-pulse mb-8" />}>
        <ShopFilterBar
          categories={categories}
          currentCategory={category}
          currentSort={sort}
          currentSearch={search}
        />
      </React.Suspense>

      {/* Products Grid */}
      <ProductGrid
        products={products}
        emptyTitle="No crafts match your filter"
        emptyDescription={
          search
            ? `We couldn't find any handmade crafts matching "${search}". Try checking for typos or searching a broader term.`
            : "No products currently available in this category. Please check back soon!"
        }
      />
    </div>
  );
}
