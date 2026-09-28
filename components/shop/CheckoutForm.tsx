"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Banknote,
  ShieldCheck,
  AlertCircle,
  Truck,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { formatPrice } from "@/lib/utils/format";
import { STORE_CONFIG } from "@/lib/constants/config";
import { createOrder, CheckoutFormInput } from "@/app/actions/checkout";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "Dhaka",
    area: "",
    deliveryInstructions: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = STORE_CONFIG.defaultDeliveryFee;
  const grandTotal = subtotal + deliveryFee;

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.customerName.trim()) {
      errors.customerName = "Full Name is required.";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (formData.phone.trim().length < 7) {
      errors.phone = "Please enter a valid contact number.";
    }
    if (!formData.address.trim()) {
      errors.address = "Street address is required for delivery.";
    }
    if (!formData.city.trim()) {
      errors.city = "City is required.";
    }
    if (!formData.area.trim()) {
      errors.area = "Area or neighborhood is required.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (items.length === 0) {
      setServerError("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload: CheckoutFormInput = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        area: formData.area,
        deliveryInstructions: formData.deliveryInstructions,
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      };

      const result = await createOrder(orderPayload);

      if (result.success && result.orderNumber) {
        clearCart();
        router.push(`/order-success/${result.orderNumber}`);
      } else {
        setServerError(result.error || "Failed to place your order. Please check your cart or try again.");
      }
    } catch (err) {
      console.error("Checkout submit error:", err);
      setServerError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F3ECE2] text-[#B85D3B] flex items-center justify-center mx-auto mb-4">
          <Truck className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl font-medium text-[#2D231E] mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-[#6B5C52] mb-6">
          You need at least one handmade item in your cart to proceed to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#B85D3B] text-white text-sm font-medium hover:bg-[#9E4B2C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Handmade Crafts</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#8A7B70] hover:text-[#B85D3B] mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Cart</span>
        </Link>
        <h1 className="font-serif text-3xl font-medium text-[#2D231E]">
          Complete Your Order
        </h1>
        <p className="text-xs text-[#6B5C52] mt-1">
          No online payment needed. Pay in cash when your parcel is delivered.
        </p>
      </div>

      {serverError && (
        <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <h4 className="font-semibold mb-0.5">Order Placement Issue</h4>
            <p className="text-xs leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Form Column (Left) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Information Card */}
          <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-medium text-[#2D231E] border-b border-[#F3ECE2] pb-3 flex items-center justify-between">
              <span>Customer & Delivery Details</span>
              <span className="text-[11px] font-sans text-[#8A7B70] font-normal">
                * Required fields
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ayesha Rahman"
                  value={formData.customerName}
                  onChange={(e) => {
                    setFormData({ ...formData, customerName: e.target.value });
                    if (fieldErrors.customerName) setFieldErrors({ ...fieldErrors, customerName: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#2D231E] focus:outline-none transition-colors ${
                    fieldErrors.customerName
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-[#EADBCE] bg-[#FAF7F2] focus:border-[#B85D3B]"
                  }`}
                />
                {fieldErrors.customerName && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.customerName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
                  Phone Number (For Delivery Confirmation) *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 01712345678"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#2D231E] focus:outline-none transition-colors ${
                    fieldErrors.phone
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-[#EADBCE] bg-[#FAF7F2] focus:border-[#B85D3B]"
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone}</p>
                )}
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. ayesha@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] bg-[#FAF7F2] text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
                />
              </div>

              {/* Street Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
                  Street Address & House/Apartment Details *
                </label>
                <textarea
                  rows={2}
                  placeholder="House number, road number, apartment floor/flat..."
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (fieldErrors.address) setFieldErrors({ ...fieldErrors, address: "" });
                  }}
                  className={`w-full px-3.5 py-2 rounded-lg border text-sm text-[#2D231E] focus:outline-none transition-colors ${
                    fieldErrors.address
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-[#EADBCE] bg-[#FAF7F2] focus:border-[#B85D3B]"
                  }`}
                />
                {fieldErrors.address && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.address}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Chittagong, Sylhet..."
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (fieldErrors.city) setFieldErrors({ ...fieldErrors, city: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#2D231E] focus:outline-none transition-colors ${
                    fieldErrors.city
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-[#EADBCE] bg-[#FAF7F2] focus:border-[#B85D3B]"
                  }`}
                />
                {fieldErrors.city && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.city}</p>
                )}
              </div>

              {/* Area */}
              <div>
                <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
                  Area / Thana / Sub-district *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhanmondi, Gulshan, Uttara..."
                  value={formData.area}
                  onChange={(e) => {
                    setFormData({ ...formData, area: e.target.value });
                    if (fieldErrors.area) setFieldErrors({ ...fieldErrors, area: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#2D231E] focus:outline-none transition-colors ${
                    fieldErrors.area
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-[#EADBCE] bg-[#FAF7F2] focus:border-[#B85D3B]"
                  }`}
                />
                {fieldErrors.area && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.area}</p>
                )}
              </div>

              {/* Additional Delivery Instructions */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery, leave with building guard..."
                  value={formData.deliveryInstructions}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryInstructions: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] bg-[#FAF7F2] text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card - Only Cash on Delivery */}
          <div className="bg-white rounded-2xl border-2 border-[#B85D3B] p-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-[#F3ECE2] text-[#B85D3B] shrink-0">
                <Banknote className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-medium text-[#2D231E]">
                    Payment Method: Cash on Delivery
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#556B59] bg-[#556B59]/10 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selected
                  </span>
                </div>
                <p className="text-xs text-[#6B5C52] mt-1.5 leading-relaxed">
                  Pay directly in cash to the courier representative when your handmade parcel is delivered to your doorstep. No online transaction required.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Column (Right) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 shadow-xs space-y-5 sticky top-28">
            <h2 className="font-serif text-xl font-medium text-[#2D231E] border-b border-[#F3ECE2] pb-3">
              Order Summary ({items.length} {items.length === 1 ? "Item" : "Items"})
            </h2>

            {/* Line Items List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-[#FAF7F2]">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#F3ECE2]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-[#2D231E] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#8A7B70]">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#2D231E] shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal & Delivery Fee Breakdown */}
            <div className="space-y-2 pt-2 border-t border-[#F3ECE2] text-xs text-[#6B5C52]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-[#2D231E]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#B85D3B]" />
                  <span>Standard Delivery Fee</span>
                </span>
                <span className="font-medium text-[#2D231E]">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#EADBCE] text-base">
                <span className="font-serif font-medium text-[#2D231E]">Total Amount Due</span>
                <span className="font-serif font-bold text-[#B85D3B]">
                  {formatPrice(grandTotal)}
                </span>
              </div>
              <p className="text-[11px] text-[#8A7B70] text-right">
                Payable via Cash on Delivery
              </p>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-[#B85D3B] hover:bg-[#9E4B2C] text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Order (Cash on Delivery)</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8A7B70] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#556B59]" />
              <span>Safe & reliable delivery. Pay only upon inspection.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
