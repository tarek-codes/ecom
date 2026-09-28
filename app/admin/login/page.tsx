"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Sparkles, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { loginAdmin } from "@/app/actions/admin-auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await loginAdmin(null, formData);

      if (result.success) {
        router.push(returnUrl);
        router.refresh();
      } else {
        setError(result.error || "Invalid email or password.");
      }
    } catch {
      setError("An unexpected connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
          Admin Email
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@resincraft.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl bg-[#B85D3B] hover:bg-[#9E4B2C] text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          <span>Sign In to Dashboard</span>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center p-4">
      {/* Back to storefront link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-[#8A7B70] hover:text-[#B85D3B] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Customer Store</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EADBCE] shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F3ECE2] text-[#B85D3B] flex items-center justify-center mx-auto border border-[#EADBCE]">
            <Sparkles className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#2D231E]">
            Admin Workspace
          </h1>
          <p className="text-xs text-[#6B5C52]">
            Sign in to manage crafts, inventory, and incoming orders.
          </p>
        </div>

        <Suspense fallback={<div className="h-40 flex items-center justify-center text-xs text-stone-400">Loading secure login...</div>}>
          <LoginForm />
        </Suspense>

        <div className="pt-4 border-t border-[#F3ECE2] text-center">
          <p className="text-[11px] text-[#8A7B70] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#556B59]" />
            <span>Secure session with HttpOnly encrypted cookies</span>
          </p>
        </div>
      </div>
    </div>
  );
}
