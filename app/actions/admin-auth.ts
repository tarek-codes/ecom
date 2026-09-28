"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { createSessionToken, setAdminSessionCookie, clearAdminSessionCookie } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export interface LoginResult {
  success: boolean;
  error?: string;
}

export async function loginAdmin(prevState: unknown, formData: FormData): Promise<LoginResult> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, error: "Please provide both email and password." };
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return { success: false, error: "Invalid email or password." };
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password." };
    }

    const token = await createSessionToken({
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
    });

    await setAdminSessionCookie(token);

    return { success: true };
  } catch (error) {
    console.error("Admin login error:", error);
    return { success: false, error: "An unexpected error occurred during login." };
  }
}

export async function logoutAdmin() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
