import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image?: string | null;
    _count?: {
      products: number;
    };
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#EADBCE] hover:border-[#B85D3B]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Category Image Header */}
        <div className="relative aspect-16/10 w-full bg-[#F3ECE2] overflow-hidden">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#B85D3B]">
              <Sparkles className="w-8 h-8 stroke-[1.5]" />
            </div>
          )}

          {/* Gradient Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Product Count Badge on Top of Image */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#2D231E] text-[11px] font-semibold tracking-wide shadow-xs">
              {category._count?.products !== undefined
                ? `${category._count.products} ${category._count.products === 1 ? "Piece" : "Pieces"}`
                : "Explore"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <h3 className="font-serif text-xl font-medium text-[#2D231E] group-hover:text-[#B85D3B] transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-[#6B5C52] mt-1.5 line-clamp-2 leading-relaxed">
            {category.description || "Discover handcrafted creations in this collection."}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-[#F3ECE2] flex items-center justify-between text-xs font-semibold text-[#B85D3B]">
        <span>Browse Collection</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
