"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { slugify } from "@/lib/utils/format";
import { revalidatePath } from "next/cache";

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export async function createCategoryAction(data: CategoryFormData) {
  await requireAdmin();

  if (!data.name || data.name.trim().length === 0) {
    return { success: false, error: "Category name is required." };
  }

  try {
    let slug = data.slug ? slugify(data.slug) : slugify(data.name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const category = await prisma.category.create({
      data: {
        name: data.name.trim(),
        slug,
        description: data.description?.trim() || null,
        image: data.image?.trim() || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");

    return { success: true, category };
  } catch (error) {
    console.error("Create category error:", error);
    return { success: false, error: "Failed to create category." };
  }
}

export async function updateCategoryAction(id: string, data: CategoryFormData) {
  await requireAdmin();

  if (!data.name || data.name.trim().length === 0) {
    return { success: false, error: "Category name is required." };
  }

  try {
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    await prisma.category.update({
      where: { id },
      data: {
        name: data.name.trim(),
        slug,
        description: data.description?.trim() || null,
        image: data.image?.trim() || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    console.error("Update category error:", error);
    return { success: false, error: "Failed to update category." };
  }
}

export async function toggleCategoryActiveAction(id: string, isActive: boolean) {
  await requireAdmin();

  try {
    await prisma.category.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    console.error("Toggle category status error:", error);
    return { success: false, error: "Failed to update category status." };
  }
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();

  try {
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return {
        success: false,
        error: `Cannot delete this category because it contains ${productCount} product(s). Please reassign or deactivate them first.`,
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, error: "Failed to delete category." };
  }
}
