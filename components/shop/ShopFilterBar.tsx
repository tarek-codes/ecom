"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ShopFilterBarProps {
  categories: CategoryOption[];
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
}

export function ShopFilterBar({
  categories,
  currentCategory,
  currentSort = "newest",
  currentSearch = "",
}: ShopFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/shop?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchVal = formData.get("search")?.toString().trim();
    updateFilters({ search: searchVal || null });
  };

  const hasActiveFilters = !!currentCategory || !!currentSearch || currentSort !== "newest";

  const clearAllFilters = () => {
    router.push("/shop");
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EADBCE] p-4 sm:p-5 shadow-xs mb-8 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="search"
            defaultValue={currentSearch}
            placeholder="Search crafts by name or keywords..."
            className="w-full pl-10 pr-20 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#B85D3B] text-white text-xs font-medium rounded-lg hover:bg-[#9E4B2C] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Sorting dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-[#8A7B70] shrink-0 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </label>
          <select
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-xs font-medium text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="pt-2 border-t border-[#F3ECE2] flex flex-wrap items-center gap-2">
        <button
          onClick={() => updateFilters({ category: null })}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !currentCategory
              ? "bg-[#B85D3B] text-white"
              : "bg-[#FAF7F2] text-[#6B5C52] hover:bg-[#F3ECE2] border border-[#EADBCE]"
          }`}
        >
          All Items
        </button>

        {categories.map((cat) => {
          const isSelected = currentCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => updateFilters({ category: isSelected ? null : cat.slug })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-[#B85D3B] text-white"
                  : "bg-[#FAF7F2] text-[#6B5C52] hover:bg-[#F3ECE2] border border-[#EADBCE]"
              }`}
            >
              {cat.name}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="ml-auto inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium py-1 px-2 rounded hover:bg-rose-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
