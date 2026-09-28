import React from "react";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/shop/ProductDetails";
import { ProductGrid } from "@/components/shop/ProductGrid";
import {
  getCachedProductBySlug,
  getCachedRelatedProducts,
} from "@/lib/db/queries";
import type { Metadata } from "next";

export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic SEO metadata using cached product lookup
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);

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

  // Cached product retrieval
  const fullProduct = await getCachedProductBySlug(slug);

  if (!fullProduct) {
    notFound();
  }

  // Cached related products from the same category
  const relatedProducts = await getCachedRelatedProducts(
    fullProduct.category.id,
    fullProduct.id
  );

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
