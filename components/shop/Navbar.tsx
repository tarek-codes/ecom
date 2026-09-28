"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, X, Sparkles } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { STORE_CONFIG } from "@/lib/constants/config";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top artisanal announcement bar */}
      <div className="bg-[#2D231E] text-[#F3ECE2] py-2 px-4 text-center text-xs tracking-wide">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Every piece crafted by hand with real botanicals and pure resin</span>
          <span className="hidden sm:inline text-[#A88B77]">•</span>
          <span className="hidden sm:inline text-[#D4A373] font-medium">Cash on Delivery Available</span>
        </span>
      </div>

      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADBCE] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#2D231E] hover:text-[#B85D3B] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
              <Link href="/" className="group flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#F3ECE2] border border-[#EADBCE] flex items-center justify-center text-[#B85D3B] group-hover:bg-[#B85D3B] group-hover:text-white transition-all duration-300">
                  <Sparkles className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#2D231E] group-hover:text-[#B85D3B] transition-colors">
                    {STORE_CONFIG.name}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-[#8A7B70] -mt-1 font-sans">
                    Handmade Art & Keepsakes
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? "text-[#B85D3B] font-semibold"
                        : "text-[#2D231E] hover:text-[#B85D3B]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D3B] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#2D231E] hover:text-[#B85D3B] transition-colors rounded-full hover:bg-[#F3ECE2]"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Icon with Counter */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative p-2 text-[#2D231E] hover:text-[#B85D3B] transition-colors rounded-full hover:bg-[#F3ECE2] flex items-center"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#B85D3B] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Shop CTA Button (Desktop) */}
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#B85D3B] text-white text-xs font-semibold hover:bg-[#9E4B2C] transition-all shadow-xs"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-[#EADBCE] bg-white p-4 shadow-sm animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search handmade resin crafts, paper flowers, keychains..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-lg text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B] focus:ring-1 focus:ring-[#B85D3B]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#B85D3B] text-white text-sm font-medium rounded-lg hover:bg-[#9E4B2C] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2.5 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EADBCE] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? "bg-[#F3ECE2] text-[#B85D3B] font-semibold"
                        : "text-[#2D231E] hover:bg-[#F3ECE2]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#EADBCE] flex flex-col gap-2">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-lg bg-[#B85D3B] text-white text-sm font-medium hover:bg-[#9E4B2C] transition-colors"
              >
                Browse All Crafts
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-lg border border-[#EADBCE] text-[#2D231E] text-sm font-medium hover:bg-[#F3ECE2] transition-colors"
              >
                View Cart ({itemCount})
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
