"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Store error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-5 border border-rose-200">
        <AlertCircle className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h2 className="font-serif text-3xl font-medium text-[#2D231E] mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-[#6B5C52] leading-relaxed mb-6">
        An unexpected error occurred while loading this handcrafted view.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B85D3B] text-white text-sm font-medium hover:bg-[#9E4B2C] transition-colors shadow-xs"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
