import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Heart, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2] py-16 sm:py-24 border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text / Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EADBCE]/60 text-[#B85D3B] text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Small-Batch Artisan Studio</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2D231E] font-medium leading-[1.15] tracking-tight">
              Handmade Treasures in <span className="italic text-[#B85D3B]">Resin</span> &amp; <span className="italic text-[#556B59]">Paper</span>.
            </h1>

            <p className="text-sm sm:text-base text-[#6B5C52] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              We preserve delicate real wildflowers in crystal-clear resin and hand-sculpt bespoke paper blooms that never fade. Made thoughtfully for meaningful gifting and heartfelt spaces.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#B85D3B] text-white font-medium text-sm hover:bg-[#9E4B2C] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Explore the Shop</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/about"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#EADBCE] bg-white text-[#2D231E] font-medium text-sm hover:bg-[#FAF7F2] transition-colors flex items-center justify-center"
              >
                Our Handcrafted Story
              </Link>
            </div>

            {/* Mini Trust Highlights */}
            <div className="pt-6 border-t border-[#EADBCE]/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#8A7B70]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#B85D3B]" />
                <span>Crafted by Hand</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#556B59]" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4A373]" />
                <span>Real Botanicals</span>
              </div>
            </div>
          </div>

          {/* Right Featured Handcrafted Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Main Visual Image */}
              <div className="relative aspect-4/3 sm:aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#F3ECE2]">
                <Image
                  src="/hero-craft.jpg"
                  alt="Handcrafted Resin & Paper Craft Art"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 45vw"
                />
              </div>

              {/* Floating Artistic Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-[#EADBCE] shadow-lg max-w-[200px]">
                <p className="font-serif text-sm font-semibold text-[#2D231E]">
                  Preserved Blooms
                </p>
                <p className="text-[11px] text-[#6B5C52] mt-0.5 leading-snug">
                  Every botanical petal is hand-picked and naturally dried.
                </p>
              </div>

              {/* Floating COD Badge */}
              <div className="absolute -top-4 -right-4 bg-[#556B59] text-white p-3 rounded-2xl shadow-md text-xs font-medium flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>Pay on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
