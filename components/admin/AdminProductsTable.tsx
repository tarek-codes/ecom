"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Plus,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { toggleProductActiveAction, deleteProductAction } from "@/app/actions/admin-products";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  mainImage: string;
  isActive: boolean;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
  };
}

interface AdminProductsTableProps {
  initialProducts: AdminProductRow[];
  categories: Array<{ id: string; name: string; slug: string }>;
}

export function AdminProductsTable({
  initialProducts,
  categories,
}: AdminProductsTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await toggleProductActiveAction(id, !currentStatus);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: !currentStatus } : p))
        );
        showNotification("success", `Product visibility changed to ${!currentStatus ? "Active" : "Inactive"}.`);
      }
    } catch {
      showNotification("error", "Failed to update product visibility.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      const res = await deleteProductAction(deleteId);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteId));
        showNotification("success", res.message || "Product removed.");
      } else {
        showNotification("error", res.error || "Failed to delete product.");
      }
    } catch {
      showNotification("error", "Network error while deleting product.");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || p.category.id === selectedCategory;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && p.isActive) ||
      (statusFilter === "inactive" && !p.isActive) ||
      (statusFilter === "outOfStock" && p.stock <= 0);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between shadow-xs transition-all ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Filter and Action Header */}
      <div className="bg-white p-4 rounded-2xl border border-[#EADBCE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs font-medium text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs font-medium text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="outOfStock">Out of Stock</option>
          </select>

          <Link
            href="/admin/products/new"
            className="px-4 py-2 rounded-xl bg-[#B85D3B] hover:bg-[#9E4B2C] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 ml-auto md:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#EADBCE] shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8A7B70]">
            No products match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2D231E]">
              <thead className="bg-[#FAF7F2] text-[#8A7B70] uppercase tracking-wider font-semibold border-b border-[#EADBCE]">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Stock</th>
                  <th className="py-3.5 px-6">Visibility</th>
                  <th className="py-3.5 px-6">Featured</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3ECE2]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* Product Image & Title */}
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#F3ECE2] border border-[#EADBCE]">
                          <Image
                            src={product.mainImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="font-medium text-[#2D231E] hover:text-[#B85D3B] flex items-center gap-1 line-clamp-1"
                          >
                            <span>{product.name}</span>
                            <ExternalLink className="w-3 h-3 opacity-40 shrink-0" />
                          </Link>
                          <span className="text-[10px] text-[#8A7B70] font-mono">
                            /{product.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-6 text-[#6B5C52]">
                      {product.category.name}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-6 font-semibold text-[#2D231E]">
                      {formatPrice(product.price)}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-6">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          product.stock <= 0
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : product.stock <= 3
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {product.stock <= 0 ? "Out of Stock" : `${product.stock} units`}
                      </span>
                    </td>

                    {/* Visibility Toggle */}
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleToggleActive(product.id, product.isActive)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                          product.isActive
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                            : "bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200"
                        }`}
                        title="Click to toggle visibility"
                      >
                        {product.isActive ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-6 text-[#6B5C52]">
                      {product.isFeatured ? (
                        <span className="text-[11px] text-[#B85D3B] font-semibold bg-[#B85D3B]/10 px-2 py-0.5 rounded">
                          Pinned
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-stone-500 hover:text-[#B85D3B] hover:bg-[#F3ECE2] rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete or Deactivate Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deletion / Deactivation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Remove or Deactivate Product"
        message="Are you sure you want to remove this product? If this product has historical orders, it will be safely deactivated to preserve sales records without breaking past orders."
        confirmText="Confirm Remove"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
