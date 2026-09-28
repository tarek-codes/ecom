import React from "react";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopFilterBar } from "@/components/shop/ShopFilterBar";
import { getCachedShopProducts, getCachedCategoryList } from "@/lib/db/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Handmade Crafts & Botanicals",
  description:
    "Explore our complete collection of handmade resin jewelry, pressed flower bookmarks, paper floral bouquets, and bespoke artisan gifts.",
};

export const revalidate = 300;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, search, sort = "newest" } = await searchParams;

  // Concurrently fetch cached products and cached categories
  const [products, categories] = await Promise.all([
    getCachedShopProducts(category, search, sort),
    getCachedCategoryList(),
  ]);

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
