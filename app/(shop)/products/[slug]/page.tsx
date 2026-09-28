import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ProductDetails, FullProduct } from "@/components/shop/ProductDetails";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SerializedProduct } from "@/components/shop/ProductCard";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    select: { name: true, description: true, mainImage: true },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Resin & Paper Craft`,
      description: product.description.slice(0, 160),
      images: [{ url: product.mainImage, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const dbProduct = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!dbProduct) {
    notFound();
  }

  // Related products from the same category
  const relatedDbProducts = await prisma.product.findMany({
    where: {
      categoryId: dbProduct.categoryId,
      isActive: true,
      NOT: { id: dbProduct.id },
    },
    take: 4,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  const fullProduct: FullProduct = {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    description: dbProduct.description,
    price: Number(dbProduct.price),
    stock: dbProduct.stock,
    mainImage: dbProduct.mainImage,
    category: dbProduct.category,
    images: dbProduct.images.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      sortOrder: img.sortOrder,
    })),
  };

  const relatedProducts: SerializedProduct[] = relatedDbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    stock: p.stock,
    mainImage: p.mainImage,
    isFeatured: p.isFeatured,
    category: p.category,
  }));

  return (
    <div className="space-y-16 pb-20">
      <ProductDetails product={fullProduct} />

      {/* Related handmade products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#EADBCE]">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B85D3B] block mb-1">
              Complementary Pieces
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#2D231E]">
              You May Also Love
            </h2>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
