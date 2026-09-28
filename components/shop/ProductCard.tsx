"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Eye, Check, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { useCart } from "@/lib/context/CartContext";

export interface SerializedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  mainImage: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  isFeatured?: boolean;
}

export function ProductCard({ product }: { product: SerializedProduct }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    const result = addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.mainImage,
      stock: product.stock,
    });

    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } else if (result.message) {
      setErrorMessage(result.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#EADBCE] overflow-hidden flex flex-col hover:border-[#B85D3B]/40 hover:shadow-lg transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-[#F3ECE2] overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Stock / Featured Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium tracking-wide">
              Out of Stock
            </span>
          ) : product.stock <= 3 ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-600/90 backdrop-blur-xs text-white text-[11px] font-medium tracking-wide">
              Only {product.stock} left
            </span>
          ) : null}

          {product.isFeatured && (
            <span className="px-2.5 py-1 rounded-full bg-[#B85D3B] text-white text-[11px] font-medium tracking-wide shadow-xs">
              Handmade Pick
            </span>
          )}
        </div>

        {/* Quick View Link Button on Hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4 pointer-events-none">
          <Link
            href={`/products/${product.slug}`}
            className="pointer-events-auto p-3 rounded-full bg-white/95 text-[#2D231E] hover:text-[#B85D3B] hover:scale-110 shadow-md transition-all"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <Link
            href={`/shop?category=${product.category.slug}`}
            className="text-[11px] uppercase tracking-wider font-semibold text-[#8A7B70] hover:text-[#B85D3B] transition-colors"
          >
            {product.category.name}
          </Link>

          {/* Title */}
          <h3 className="font-serif text-base sm:text-lg font-medium text-[#2D231E] mt-1 line-clamp-1 group-hover:text-[#B85D3B] transition-colors">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-[#6B5C52] mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 mt-3 border-t border-[#F3ECE2]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs text-[#8A7B70] block">Price</span>
              <span className="font-serif text-lg font-semibold text-[#2D231E]">
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#8A7B70] block">Availability</span>
              <span
                className={`text-xs font-medium ${
                  isOutOfStock
                    ? "text-rose-600"
                    : product.stock <= 3
                    ? "text-amber-600"
                    : "text-emerald-700"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-2 p-2 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="w-full py-2 px-3 text-center text-xs font-medium text-[#2D231E] bg-[#F3ECE2] hover:bg-[#EADBCE] rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Details</span>
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                isOutOfStock
                  ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                  : added
                  ? "bg-[#556B59] text-white"
                  : "bg-[#B85D3B] hover:bg-[#9E4B2C] text-white"
              }`}
            >
              {isOutOfStock ? (
                <span>Unavailable</span>
              ) : added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
