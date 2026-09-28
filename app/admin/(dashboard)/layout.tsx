import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminSidebarProvider } from "@/components/admin/AdminSidebarContext";
import { requireAdmin } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Strictly enforce server-side admin authentication
  await requireAdmin();

  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen bg-[#FAF7F2]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
