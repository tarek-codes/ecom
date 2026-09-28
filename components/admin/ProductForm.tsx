"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  createProductAction,
  updateProductAction,
  ProductFormData,
} from "@/app/actions/admin-products";
import { AlertCircle, Plus, Trash2, ArrowLeft, Check, Upload, Loader2, Link2 } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    mainImage: string;
    isFeatured: boolean;
    isActive: boolean;
    additionalImages: string[];
  };
  categories: CategoryOption[];
  isEditing?: boolean;
}

export function ProductForm({
  initialData,
  categories,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 10,
    categoryId: initialData?.categoryId || (categories[0]?.id || ""),
    mainImage: initialData?.mainImage || "",
    additionalImages: initialData?.additionalImages || [],
    isFeatured: initialData?.isFeatured ?? false,
    isActive: initialData?.isActive ?? true,
  });

  const [newImageInput, setNewImageInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");

  // Helper for uploading file to /api/admin/upload
  const uploadFile = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    if (!res.ok || !json.url) {
      throw new Error(json.error || "Upload failed");
    }

    return json.url;
  };

  const handleMainFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    setError("");

    try {
      const url = await uploadFile(file);
      setFormData((prev) => ({ ...prev, mainImage: url }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingMain(false);
      e.target.value = "";
    }
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i]);
        uploadedUrls.push(url);
      }
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...(prev.additionalImages || []), ...uploadedUrls],
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload gallery images.");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleAddAdditionalImage = () => {
    if (newImageInput.trim()) {
      setFormData({
        ...formData,
        additionalImages: [...(formData.additionalImages || []), newImageInput.trim()],
      });
      setNewImageInput("");
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    const updated = [...(formData.additionalImages || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, additionalImages: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Product Name is required.");
      return;
    }
    if (!formData.categoryId) {
      setError("Please select a category.");
      return;
    }
    if (Number(formData.price) <= 0) {
      setError("Price must be greater than zero.");
      return;
    }
    if (!formData.mainImage.trim()) {
      setError("Main Image is required (please upload an image or provide a URL).");
      return;
    }

    setLoading(true);

    try {
      const payload: ProductFormData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      let result;
      if (isEditing && initialData) {
        result = await updateProductAction(initialData.id, payload);
      } else {
        result = await createProductAction(payload);
      }

      if (result.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(result.error || "Failed to save product.");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      {/* Return button */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-[#8A7B70] hover:text-[#B85D3B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="font-serif text-xl font-medium text-[#2D231E] border-b border-[#F3ECE2] pb-3">
          Product Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pressed Flower Resin Bookmark"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
              URL Slug (Optional - Auto-generated if left empty)
            </label>
            <input
              type="text"
              placeholder="pressed-flower-resin-bookmark"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
              Unit Price (BDT) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              min="1"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
              Available Stock Quantity *
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
              Full Description & Handcraft Details
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe materials, size, dried botanicals, colors, and instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
            />
          </div>
        </div>
      </div>

      {/* Imagery Card with File Upload & URL Toggle */}
      <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F3ECE2] pb-3 gap-3">
          <h2 className="font-serif text-xl font-medium text-[#2D231E]">
            Product Imagery
          </h2>

          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EADBCE]">
            <button
              type="button"
              onClick={() => setImageMode("upload")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                imageMode === "upload"
                  ? "bg-[#B85D3B] text-white shadow-xs"
                  : "text-[#6B5C52] hover:text-[#2D231E]"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Direct File Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setImageMode("url")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                imageMode === "url"
                  ? "bg-[#B85D3B] text-white shadow-xs"
                  : "text-[#6B5C52] hover:text-[#2D231E]"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Image URL</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Image Section */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#2D231E]">
              Primary Product Image *
            </label>

            {imageMode === "upload" ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="relative flex flex-col items-center justify-center w-full sm:w-64 h-32 border-2 border-dashed border-[#EADBCE] hover:border-[#B85D3B] rounded-2xl cursor-pointer bg-[#FAF7F2] hover:bg-[#F3ECE2] transition-colors p-4 text-center">
                  {uploadingMain ? (
                    <div className="flex flex-col items-center gap-2 text-xs text-[#B85D3B]">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Uploading to studio...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-xs text-[#6B5C52]">
                      <Upload className="w-6 h-6 text-[#B85D3B]" />
                      <span className="font-semibold text-[#2D231E]">Choose image file</span>
                      <span className="text-[10px] text-[#8A7B70]">PNG, JPG, WebP up to 10MB</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingMain}
                    onChange={handleMainFileUpload}
                    className="hidden"
                  />
                </label>

                {formData.mainImage && (
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-[#EADBCE] bg-[#FAF7F2] shrink-0 shadow-xs">
                    <Image
                      src={formData.mainImage}
                      alt="Main preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                      Selected
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  value={formData.mainImage}
                  onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
                />
                {formData.mainImage && (
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-[#EADBCE] bg-[#FAF7F2]">
                    <Image
                      src={formData.mainImage}
                      alt="Main preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Additional Gallery Images Section */}
          <div className="pt-6 border-t border-[#F3ECE2] space-y-3">
            <label className="block text-xs font-semibold text-[#2D231E]">
              Additional Gallery Images (Optional)
            </label>

            {imageMode === "upload" ? (
              <div className="space-y-3">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] hover:bg-[#F3ECE2] text-xs font-medium text-[#2D231E] cursor-pointer transition-colors shadow-xs">
                  {uploadingGallery ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#B85D3B]" />
                      <span>Uploading files...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-[#B85D3B]" />
                      <span>Upload Gallery Files</span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={uploadingGallery}
                    onChange={handleGalleryFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste image URL here..."
                  value={newImageInput}
                  onChange={(e) => setNewImageInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] text-xs text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
                />
                <button
                  type="button"
                  onClick={handleAddAdditionalImage}
                  className="px-4 py-2 bg-[#556B59] text-white text-xs font-medium rounded-xl hover:bg-[#455748] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add URL</span>
                </button>
              </div>
            )}

            {/* Gallery Thumbnails List */}
            {formData.additionalImages && formData.additionalImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                {formData.additionalImages.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-[#EADBCE] aspect-square bg-[#FAF7F2] shadow-xs"
                  >
                    <Image
                      src={url}
                      alt={`Gallery item ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visibility & Badges Card */}
      <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-serif text-xl font-medium text-[#2D231E] border-b border-[#F3ECE2] pb-3">
          Visibility &amp; Badges
        </h2>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded text-[#B85D3B] focus:ring-[#B85D3B]"
            />
            <div>
              <span className="text-xs font-semibold text-[#2D231E] block">
                Active in Store (Publicly visible)
              </span>
              <span className="text-[11px] text-[#6B5C52]">
                When disabled, customers cannot see or purchase this product.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded text-[#B85D3B] focus:ring-[#B85D3B]"
            />
            <div>
              <span className="text-xs font-semibold text-[#2D231E] block">
                Featured Product (Show on Homepage)
              </span>
              <span className="text-[11px] text-[#6B5C52]">
                Pin this craft to the homepage curated showcase.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/admin/products"
          className="px-5 py-2.5 rounded-xl border border-[#EADBCE] text-xs font-medium text-[#2D231E] hover:bg-[#F3ECE2] transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading || uploadingMain || uploadingGallery}
          className="px-6 py-2.5 rounded-xl bg-[#B85D3B] hover:bg-[#9E4B2C] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>{isEditing ? "Save Changes" : "Create Product"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
