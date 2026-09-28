import React from "react";
import { ProductCard, SerializedProduct } from "./ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sparkles } from "lucide-react";

interface ProductGridProps {
  products: SerializedProduct[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  emptyTitle = "No handmade crafts found",
  emptyDescription = "Try adjusting your search or category filter to discover other handcrafted pieces.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title={emptyTitle}
        description={emptyDescription}
        actionText="View All Products"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
