"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { formatPrice } from "@/lib/utils/format";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#EADBCE] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#EADBCE] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B85D3B]" />
              <h2 className="font-serif text-xl font-medium text-[#2D231E]">
                Shopping Cart ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-14 h-14 rounded-full bg-[#F3ECE2] text-[#B85D3B] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-lg text-[#2D231E] font-medium mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-[#6B5C52] max-w-xs mb-6">
                  Discover something handmade for yourself or someone special.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-5 py-2 rounded-lg bg-[#B85D3B] text-white text-sm font-medium hover:bg-[#9E4B2C] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-[#EADBCE] shadow-xs"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsDrawerOpen(false)}
                          className="font-medium text-sm text-[#2D231E] hover:text-[#B85D3B] line-clamp-1 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition-colors shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-[#B85D3B] mt-0.5">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#EADBCE] rounded-md bg-[#FAF7F2]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#F3ECE2] text-stone-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium text-[#2D231E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 hover:bg-[#F3ECE2] text-stone-600 transition-colors disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-medium text-stone-500">
                        Total: {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#EADBCE] bg-white space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between text-[#6B5C52]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#2D231E]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Payment</span>
                  <span className="font-medium text-[#556B59]">Cash on Delivery</span>
                </div>
                <p className="text-xs text-stone-400">
                  Delivery fee calculated at checkout.
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#B85D3B] text-white text-sm font-medium hover:bg-[#9E4B2C] transition-colors shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg border border-[#EADBCE] text-[#2D231E] text-sm font-medium hover:bg-[#F3ECE2] transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
