import React from "react";
import { getAdminSession } from "@/lib/auth/session";
import { User } from "lucide-react";
import { MobileMenuButton } from "./MobileMenuButton";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export async function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  const session = await getAdminSession();

  return (
    <header className="bg-white border-b border-[#EADBCE] px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <MobileMenuButton />
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-semibold text-[#2D231E]">
            {title}
          </h1>
          {description && (
            <p className="text-xs text-[#6B5C52] mt-0.5 line-clamp-1 sm:line-clamp-none">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
        {actions}

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#EADBCE] text-xs text-[#2D231E] ml-auto sm:ml-0">
          <div className="w-6 h-6 rounded-full bg-[#EADBCE] text-[#B85D3B] flex items-center justify-center">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold leading-tight">{session?.name || "Admin"}</span>
            <span className="text-[10px] text-[#8A7B70] leading-tight hidden sm:inline">{session?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
