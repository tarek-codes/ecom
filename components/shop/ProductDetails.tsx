"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Check,
  Truck,
  Shield,
  ChevronRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { QuantitySelector } from "./QuantitySelector";
import { formatPrice } from "@/lib/utils/format";
import { useCart } from "@/lib/context/CartContext";

export interface FullProduct {
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
  images: Array<{
    id: string;
    imageUrl: string;
    sortOrder: number;
  }>;
}

export function ProductDetails({ product }: { product: FullProduct }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.mainImage);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const allImages = [
    product.mainImage,
    ...product.images.map((img) => img.imageUrl),
  ].filter((img, idx, self) => self.indexOf(img) === idx);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const result = addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.mainImage,
        stock: product.stock,
      },
      quantity
    );

    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else if (result.message) {
      setErrorMessage(result.message);
      setTimeout(() => setErrorMessage(""), 3500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-[#8A7B70] mb-8">
        <Link href="/" className="hover:text-[#B85D3B] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link href="/shop" className="hover:text-[#B85D3B] transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link
          href={`/shop?category=${product.category.slug}`}
          className="hover:text-[#B85D3B] transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-[#2D231E] font-medium truncate max-w-[200px] sm:max-w-xs">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Gallery Column */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#EADBCE] shadow-sm">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-stone-900 text-white text-sm font-semibold tracking-wide">
                  Currently Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === imgUrl
                      ? "border-[#B85D3B] ring-2 ring-[#B85D3B]/20"
                      : "border-[#EADBCE] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Column */}
        <div className="space-y-6">
          <div>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="inline-block text-xs uppercase tracking-widest font-semibold text-[#B85D3B] mb-2 hover:underline"
            >
              {product.category.name}
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#2D231E] font-medium leading-tight">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-4">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#B85D3B]">
                {formatPrice(product.price)}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  isOutOfStock
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : product.stock <= 3
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : product.stock <= 3
                  ? `Only ${product.stock} items left in stock`
                  : `In Stock (${product.stock} available)`}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-b border-[#EADBCE] py-6 space-y-3">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8A7B70]">
              About This Handcrafted Piece
            </h2>
            <div className="text-sm text-[#6B5C52] leading-relaxed space-y-3 whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Purchase Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#6B5C52]">Quantity:</span>
                <QuantitySelector
                  quantity={quantity}
                  max={Math.max(1, product.stock)}
                  min={1}
                  onChange={setQuantity}
                  disabled={isOutOfStock}
                />
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                  isOutOfStock
                    ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                    : added
                    ? "bg-[#556B59] text-white"
                    : "bg-[#B85D3B] hover:bg-[#9E4B2C] text-white"
                }`}
              >
                {isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart - {formatPrice(product.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Craft Trust Guarantees */}
          <div className="bg-white rounded-xl p-5 border border-[#EADBCE] space-y-3.5 text-xs text-[#6B5C52]">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#B85D3B] shrink-0" />
              <span>
                <strong>Cash on Delivery:</strong> Inspect your parcel at delivery before paying.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#B85D3B] shrink-0" />
              <span>
                <strong>Handcrafted Uniqueness:</strong> Because each piece uses natural botanicals, subtle variations make yours one-of-a-kind.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#B85D3B] shrink-0" />
              <span>
                <strong>UV-Resistant Seal:</strong> Sealed with non-yellowing, high-clarity resin to preserve blooms for years.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
