"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import {
  createCategoryAction,
  updateCategoryAction,
  toggleCategoryActiveAction,
  deleteCategoryAction,
  CategoryFormData,
} from "@/app/actions/admin-categories";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  _count: {
    products: number;
  };
}

export function CategoryManager({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "", isActive: true });
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryRow) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      isActive: cat.isActive,
    });
    setModalOpen(true);
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setFormLoading(true);

    try {
      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, formData);
        if (res.success) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id
                ? {
                    ...c,
                    name: formData.name,
                    slug: formData.slug || c.slug,
                    description: formData.description || null,
                    isActive: formData.isActive ?? true,
                  }
                : c
            )
          );
          setModalOpen(false);
          showNotification("success", "Category updated successfully.");
        } else {
          showNotification("error", res.error || "Failed to update category.");
        }
      } else {
        const res = await createCategoryAction(formData);
        if (res.success && res.category) {
          setCategories((prev) => [
            ...prev,
            { ...res.category, description: res.category.description, _count: { products: 0 } },
          ]);
          setModalOpen(false);
          showNotification("success", "Category created successfully.");
        } else {
          showNotification("error", res.error || "Failed to create category.");
        }
      }
    } catch {
      showNotification("error", "An unexpected network error occurred.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await toggleCategoryActiveAction(id, !currentStatus);
      if (res.success) {
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !currentStatus } : c))
        );
        showNotification("success", `Category marked as ${!currentStatus ? "Active" : "Inactive"}.`);
      }
    } catch {
      showNotification("error", "Failed to update category status.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      const res = await deleteCategoryAction(deleteId);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== deleteId));
        showNotification("success", "Category deleted successfully.");
      } else {
        showNotification("error", res.error || "Failed to delete category.");
      }
    } catch {
      showNotification("error", "Network error while deleting category.");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-medium text-[#2D231E]">
            Store Categories ({categories.length})
          </h2>
          <p className="text-xs text-[#8A7B70] mt-0.5">
            Organize products for easy customer navigation and filtering.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-[#B85D3B] hover:bg-[#9E4B2C] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-[#EADBCE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2D231E]">
            <thead className="bg-[#FAF7F2] text-[#8A7B70] uppercase tracking-wider font-semibold border-b border-[#EADBCE]">
              <tr>
                <th className="py-3.5 px-6">Category Name</th>
                <th className="py-3.5 px-6">Slug</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Products</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3ECE2]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-4 px-6 font-medium text-[#2D231E]">
                    {cat.name}
                  </td>
                  <td className="py-4 px-6 font-mono text-[11px] text-[#8A7B70]">
                    /{cat.slug}
                  </td>
                  <td className="py-4 px-6 text-[#6B5C52] max-w-xs truncate">
                    {cat.description || "—"}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EADBCE] text-[11px] font-semibold text-[#2D231E]">
                      {cat._count?.products || 0} products
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleActive(cat.id, cat.isActive)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                        cat.isActive
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                          : "bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {cat.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{cat.isActive ? "Active" : "Inactive"}</span>
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-stone-500 hover:text-[#B85D3B] hover:bg-[#F3ECE2] rounded-lg transition-colors"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(cat.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Category"
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
      </div>

      {/* Modal Dialog for Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#EADBCE] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F3ECE2] pb-3">
              <h3 className="font-serif text-xl font-medium text-[#2D231E]">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Resin Crafts"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  placeholder="resin-crafts"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short description of products in this collection..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#B85D3B] focus:ring-[#B85D3B]"
                />
                <span className="text-xs font-medium text-[#2D231E]">
                  Active (Visible on public storefront)
                </span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F3ECE2]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EADBCE] text-xs font-medium text-[#2D231E] hover:bg-[#F3ECE2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl bg-[#B85D3B] hover:bg-[#9E4B2C] text-white text-xs font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {formLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Category"
        message="Are you sure you want to delete this category? If there are products assigned to this category, deletion will be blocked to protect catalog integrity."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
