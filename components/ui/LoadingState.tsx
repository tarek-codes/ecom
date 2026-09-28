import React from "react";

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#EADBCE] overflow-hidden animate-pulse">
      <div className="aspect-square bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-stone-200 rounded w-1/3" />
        <div className="h-5 bg-stone-200 rounded w-3/4" />
        <div className="h-4 bg-stone-200 rounded w-full" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-stone-200 rounded w-1/4" />
          <div className="h-8 bg-stone-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-3 border-[#B85D3B]/20 border-t-[#B85D3B] rounded-full animate-spin mb-4" />
      <p className="text-sm text-[#6B5C52] font-serif">Handcrafting your view...</p>
    </div>
  );
}
