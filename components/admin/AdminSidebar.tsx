"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  ExternalLink,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";
import { logoutAdmin } from "@/app/actions/admin-auth";
import { STORE_CONFIG } from "@/lib/constants/config";
import { useAdminSidebar } from "./AdminSidebarContext";

export function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useAdminSidebar();

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#2D231E] text-[#F3ECE2] flex flex-col shrink-0 min-h-screen border-r border-[#4A3B32] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 sm:p-6 border-b border-[#4A3B32] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#B85D3B] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-semibold text-white tracking-tight">
                {STORE_CONFIG.name}
              </h2>
              <span className="text-[10px] text-[#A88B77] uppercase tracking-wider block">
                Admin Workspace
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={close}
            className="lg:hidden p-1.5 rounded-lg text-[#A88B77] hover:text-white hover:bg-[#3E312A] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#B85D3B] text-white shadow-xs"
                    : "text-[#C8B8AB] hover:text-white hover:bg-[#3E312A]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#4A3B32] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-[#A88B77] hover:text-white hover:bg-[#3E312A] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Store</span>
            </span>
          </Link>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-white hover:bg-rose-900/40 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
