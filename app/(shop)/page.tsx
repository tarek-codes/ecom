import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Flower, Scissors } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Hero } from "@/components/shop/Hero";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { SerializedProduct } from "@/components/shop/ProductCard";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  // Fetch featured products from PostgreSQL
  const featuredDbProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  // Serialize Prisma Decimal to number for client components
  const featuredProducts: SerializedProduct[] = featuredDbProducts.map((p) => ({
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

  // Fetch active categories with product counts
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          products: {
            where: { isActive: true },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Brand Introduction */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#F3ECE2] text-[#B85D3B] mb-4">
          <Flower className="w-5 h-5 stroke-[1.8]" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#2D231E] font-medium leading-tight">
          Crafted with patience, poured with intention.
        </h2>
        <p className="text-sm sm:text-base text-[#6B5C52] mt-4 leading-relaxed">
          Welcome to Resin &amp; Paper Craft. We are an artisanal workshop dedicated to celebrating everyday beauty through organic preservation and fine paper crafting. Each piece is designed to capture fleeting moments—from wildflowers in spring to delicate celebratory petals.
        </p>
      </section>

      {/* 3. Product Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B85D3B] block mb-1">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl font-medium text-[#2D231E]">
              Explore by Craft Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B85D3B] hover:text-[#9E4B2C] transition-colors"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B85D3B] block mb-1">
              Handpicked Creations
            </span>
            <h2 className="font-serif text-3xl font-medium text-[#2D231E]">
              Featured Handmade Pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B85D3B] hover:text-[#9E4B2C] transition-colors"
          >
            <span>See All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid
          products={featuredProducts}
          emptyTitle="New crafts coming soon"
          emptyDescription="We are currently pouring and finishing new pieces in the studio."
        />
      </section>

      {/* 5. Why Resin & Paper Craft? */}
      <section className="bg-[#F3ECE2]/80 border-y border-[#EADBCE] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B85D3B] block mb-2">
              Our Artisanal Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#2D231E]">
              Why Choose Resin &amp; Paper Craft?
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5C52] mt-3">
              We reject mass-produced plastics and generic decor in favor of thoughtful, slow-made art you can hold.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#B85D3B] flex items-center justify-center mx-auto border border-[#EADBCE]">
                <Flower className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#2D231E]">Real Pressed Flowers</h3>
              <p className="text-xs text-[#6B5C52] leading-relaxed">
                Hand-picked wildflowers and botanicals pressed naturally over weeks to keep their organic colors intact.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#B85D3B] flex items-center justify-center mx-auto border border-[#EADBCE]">
                <Sparkles className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#2D231E]">High-Clarity Resin</h3>
              <p className="text-xs text-[#6B5C52] leading-relaxed">
                We use premium, bubble-free, UV-resistant non-yellowing epoxy that remains crystal clear for years.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#B85D3B] flex items-center justify-center mx-auto border border-[#EADBCE]">
                <Scissors className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#2D231E]">Hand-Folded Paper</h3>
              <p className="text-xs text-[#6B5C52] leading-relaxed">
                Sculpted from heavy Japanese washi and premium cotton stock, every petal and fold is made individually.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#B85D3B] flex items-center justify-center mx-auto border border-[#EADBCE]">
                <Shield className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#2D231E]">Cash on Delivery</h3>
              <p className="text-xs text-[#6B5C52] leading-relaxed">
                Zero prepayment worry. Inspect your handmade parcel upon arrival and hand over payment directly to the courier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Heartfelt Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-[#2D231E] rounded-3xl p-8 sm:p-14 text-center text-[#F3ECE2] relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#D4A373] font-semibold">
              Looking for a meaningful gift?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium">
              Discover unique handmade treasures made just for you.
            </h2>
            <p className="text-xs sm:text-sm text-[#C8B8AB] leading-relaxed">
              Whether celebrating a birthday, commemorating a quiet milestone, or adding warm artisanal charm to your home desk.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#B85D3B] text-white text-sm font-medium hover:bg-[#9E4B2C] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Browse The Shop</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#524137] text-white text-sm font-medium hover:bg-[#3E312A] transition-colors"
              >
                Custom Order Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
