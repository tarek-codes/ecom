import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F3ECE2] text-[#B85D3B] flex items-center justify-center mx-auto mb-5 border border-[#EADBCE]">
        <Sparkles className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h2 className="font-serif text-3xl font-medium text-[#2D231E] mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-[#6B5C52] leading-relaxed mb-6">
        The handcrafted piece or page you are looking for may have been moved, renamed, or is no longer available.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B85D3B] text-white text-sm font-medium hover:bg-[#9E4B2C] transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
