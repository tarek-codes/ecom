"use client";

import React from "react";
import { Menu } from "lucide-react";
import { useAdminSidebar } from "./AdminSidebarContext";

export function MobileMenuButton() {
  const { toggle } = useAdminSidebar();

  return (
    <button
      type="button"
      onClick={toggle}
      className="lg:hidden p-2 rounded-xl text-[#2D231E] hover:bg-[#FAF7F2] border border-[#EADBCE] transition-colors"
      aria-label="Toggle admin sidebar"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
