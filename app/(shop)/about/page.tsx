import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, Flower, ArrowRight } from "lucide-react";
import { STORE_CONFIG } from "@/lib/constants/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Our Handmade Craft Studio",
  description:
    "Learn about Resin & Paper Craft — our small-batch handmade studio creating botanical resin pieces and handcrafted paper art.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18 space-y-16">
      {/* Intro */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B85D3B] block">
          Behind the Studio
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#2D231E]">
          Preserving beauty, one handcrafted piece at a time.
        </h1>
        <p className="text-sm sm:text-base text-[#6B5C52] max-w-2xl mx-auto leading-relaxed">
          {STORE_CONFIG.name} is a small handmade craft studio born out of a love for natural botanicals, clear resin artistry, and delicate paper sculpture.
        </p>
      </div>

      {/* Featured visual */}
      <div className="relative aspect-16/9 rounded-3xl overflow-hidden shadow-lg border border-[#EADBCE] bg-[#F3ECE2]">
        <Image
          src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80"
          alt="Handmade resin craft with pressed botanical flowers"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Story Sections */}
      <div className="prose max-w-none text-[#6B5C52] text-sm sm:text-base leading-relaxed space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-[#EADBCE] space-y-4">
          <h2 className="font-serif text-2xl font-medium text-[#2D231E]">
            The Resin Craft Process
          </h2>
          <p>
            Working with resin is an art of patience and stillness. Every flower, fern, and petal we embed is carefully pressed and dried naturally to retain its authentic hue.
          </p>
          <p>
            Each piece is hand-poured in micro-batches, degassed to minimize bubbles, and allowed to cure slowly over multiple days. The result is a glass-like finish that seals delicate natural botanicals forever into functional treasures like keychains, bookmarks, and coasters.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#EADBCE] space-y-4">
          <h2 className="font-serif text-2xl font-medium text-[#2D231E]">
            The Art of Hand-Sculpted Paper
          </h2>
          <p>
            Paper crafting allows us to build forms that never wither. From intricately folded origami butterflies to textured crepe paper peonies, each petal is hand-shaped, curved, and assembled petal-by-petal.
          </p>
          <p>
            We celebrate the warmth and tactile feel of quality paper, bringing everlasting floral joy to home decor, celebrations, and thoughtful gifts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EADBCE] text-center space-y-2">
            <Heart className="w-6 h-6 text-[#B85D3B] mx-auto" />
            <h3 className="font-serif font-medium text-[#2D231E]">Made with Care</h3>
            <p className="text-xs text-[#8A7B70]">
              No factory assembly lines. Every order is crafted, checked, and packed by human hands.
            </p>
          </div>

          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EADBCE] text-center space-y-2">
            <Flower className="w-6 h-6 text-[#556B59] mx-auto" />
            <h3 className="font-serif font-medium text-[#2D231E]">Natural Botanicals</h3>
            <p className="text-xs text-[#8A7B70]">
              Real blooms and foliage preserved in high-clarity, UV-stabilized resin.
            </p>
          </div>

          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EADBCE] text-center space-y-2">
            <Sparkles className="w-6 h-6 text-[#D4A373] mx-auto" />
            <h3 className="font-serif font-medium text-[#2D231E]">Unique Keepsakes</h3>
            <p className="text-xs text-[#8A7B70]">
              Because organic flowers vary naturally, no two pieces are ever identical.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#B85D3B] text-white text-sm font-medium hover:bg-[#9E4B2C] transition-colors shadow-sm"
        >
          <span>Explore All Handcrafted Pieces</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
