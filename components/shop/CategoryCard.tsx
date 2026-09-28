import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    _count?: {
      products: number;
    };
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group bg-white rounded-2xl p-6 border border-[#EADBCE] hover:border-[#B85D3B]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="w-12 h-12 rounded-xl bg-[#F3ECE2] text-[#B85D3B] flex items-center justify-center mb-4 group-hover:bg-[#B85D3B] group-hover:text-white transition-all duration-300">
          <Sparkles className="w-5 h-5 stroke-[1.8]" />
        </div>
        <h3 className="font-serif text-xl font-medium text-[#2D231E] group-hover:text-[#B85D3B] transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-[#6B5C52] mt-2 line-clamp-2 leading-relaxed">
          {category.description || "Discover handcrafted creations in this collection."}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-[#F3ECE2] flex items-center justify-between text-xs font-medium text-[#B85D3B]">
        <span>
          {category._count?.products !== undefined
            ? `${category._count.products} ${category._count.products === 1 ? "Product" : "Products"}`
            : "Explore Collection"}
        </span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
