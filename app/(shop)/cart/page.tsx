import React from "react";
import { CartView } from "@/components/shop/CartView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Shopping Cart",
  description: "Review and manage your selected handmade crafts before ordering.",
};

export default function CartPage() {
  return <CartView />;
}
