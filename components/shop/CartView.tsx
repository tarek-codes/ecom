"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { QuantitySelector } from "./QuantitySelector";
import { formatPrice } from "@/lib/utils/format";
import { STORE_CONFIG } from "@/lib/constants/config";

export function CartView() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();
  const deliveryFee = STORE_CONFIG.defaultDeliveryFee;
  const grandTotal = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F3ECE2] text-[#B85D3B] flex items-center justify-center mx-auto mb-6 border border-[#EADBCE]">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#2D231E] mb-3">
          Your cart is empty
        </h1>
        <p className="text-sm text-[#6B5C52] max-w-md mx-auto mb-8 leading-relaxed">
          Discover something handmade for yourself or someone special. Each piece is crafted with real botanicals and love.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#B85D3B] text-white text-sm font-medium hover:bg-[#9E4B2C] transition-colors shadow-sm"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#EADBCE] gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-[#2D231E]">
            Shopping Cart
          </h1>
          <p className="text-xs text-[#6B5C52] mt-1">
            You have {itemCount} {itemCount === 1 ? "handmade item" : "handmade items"} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-500 hover:text-rose-600 transition-colors self-start sm:self-auto"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cart Items Table/List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#EADBCE] p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-5"
            >
              {/* Product Thumbnail */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#F3ECE2]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-serif text-base sm:text-lg font-medium text-[#2D231E] hover:text-[#B85D3B] transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-[#8A7B70] mt-0.5">
                  Unit Price: {formatPrice(item.price)}
                </p>
                {item.quantity >= item.stock && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    Max stock reached ({item.stock} available)
                  </p>
                )}
              </div>

              {/* Quantity Selector & Line Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#FAF7F2]">
                <QuantitySelector
                  quantity={item.quantity}
                  max={item.stock}
                  min={1}
                  onChange={(qty) => updateQuantity(item.id, qty)}
                />

                <div className="text-right min-w-[80px]">
                  <span className="font-serif font-semibold text-base text-[#2D231E]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-stone-50"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4 flex items-center justify-between">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#8A7B70] hover:text-[#B85D3B] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 shadow-xs space-y-5 sticky top-28">
            <h2 className="font-serif text-xl font-medium text-[#2D231E] border-b border-[#F3ECE2] pb-3">
              Cart Summary
            </h2>

            <div className="space-y-3 text-xs text-[#6B5C52]">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-[#2D231E]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#B85D3B]" />
                  <span>Estimated Delivery</span>
                </span>
                <span className="font-medium text-[#2D231E]">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#EADBCE] text-base">
                <span className="font-serif font-medium text-[#2D231E]">Estimated Total</span>
                <span className="font-serif font-bold text-[#B85D3B]">
                  {formatPrice(grandTotal)}
                </span>
              </div>
              <p className="text-[11px] text-[#8A7B70]">
                Payment method: <strong>Cash on Delivery</strong>
              </p>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 px-6 rounded-xl bg-[#B85D3B] hover:bg-[#9E4B2C] text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 border-t border-[#F3ECE2] space-y-2 text-[11px] text-[#8A7B70]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#556B59]" />
                <span>Zero prepayment risk. Pay only when delivered.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
