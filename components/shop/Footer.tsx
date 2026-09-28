import React from "react";
import Link from "next/link";
import { Sparkles, Phone, Mail, MapPin, Clock, Heart, ShieldCheck, Truck } from "lucide-react";
import { STORE_CONFIG } from "@/lib/constants/config";

export function Footer() {
  return (
    <footer className="bg-[#2D231E] text-[#F3ECE2] pt-16 pb-12 border-t border-[#4A3B32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-12 border-b border-[#4A3B32]">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#3E312A] text-[#D4A373] shrink-0">
              <Heart className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-white mb-1">100% Handcrafted</h4>
              <p className="text-xs text-[#A88B77] leading-relaxed">
                Every single piece is poured, dried, and assembled by hand in our studio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#3E312A] text-[#D4A373] shrink-0">
              <Truck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-white mb-1">Cash on Delivery</h4>
              <p className="text-xs text-[#A88B77] leading-relaxed">
                Pay safely in cash when your handmade package arrives at your doorstep.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#3E312A] text-[#D4A373] shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-white mb-1">Careful Packaging</h4>
              <p className="text-xs text-[#A88B77] leading-relaxed">
                Bubble-wrapped and beautifully packaged with kraft paper and wax seals.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#B85D3B] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-semibold tracking-tight text-white">
                {STORE_CONFIG.name}
              </span>
            </Link>
            <p className="text-xs text-[#A88B77] leading-relaxed">
              {STORE_CONFIG.description}
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#3E312A] text-[#D4A373] text-[11px] font-medium border border-[#524137]">
                Payment: Cash on Delivery Only
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#C8B8AB]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Handmade Crafts
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Story & Craft
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
              Featured Categories
            </h4>
            <ul className="space-y-2 text-xs text-[#C8B8AB]">
              <li>
                <Link href="/shop?category=resin-crafts" className="hover:text-white transition-colors">
                  Resin Crafts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=paper-crafts" className="hover:text-white transition-colors">
                  Paper Crafts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=keychains" className="hover:text-white transition-colors">
                  Letter & Name Keychains
                </Link>
              </li>
              <li>
                <Link href="/shop?category=home-decor" className="hover:text-white transition-colors">
                  Home Decor & Coasters
                </Link>
              </li>
              <li>
                <Link href="/shop?category=gifts" className="hover:text-white transition-colors">
                  Handmade Gifts & Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
              Studio Information
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C8B8AB]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span>{STORE_CONFIG.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span>{STORE_CONFIG.contact.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and admin portal link */}
        <div className="pt-8 border-t border-[#4A3B32] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A88B77] gap-4">
          <p>© {new Date().getFullYear()} {STORE_CONFIG.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#8A7B70]">Crafted with love & care</span>
            <Link
              href="/admin/login"
              className="text-[#8A7B70] hover:text-[#D4A373] transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
