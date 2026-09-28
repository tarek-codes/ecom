import React from "react";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Cash on Delivery",
  description: "Complete your order with Cash on Delivery. Handcrafted items delivered to your doorstep.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
