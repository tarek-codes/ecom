import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";
import { SerializedProduct } from "@/components/shop/ProductCard";
import { FullProduct } from "@/components/shop/ProductDetails";

export const CACHE_TAGS = {
  products: "products",
  categories: "categories",
  product: (slug: string) => `product-${slug}`,
} as const;

/**
 * Cached fetch of featured products for homepage
 */
export const getCachedFeaturedProducts = unstable_cache(
  async (): Promise<SerializedProduct[]> => {
    const featuredDbProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return featuredDbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      stock: p.stock,
      mainImage: p.mainImage,
      isFeatured: p.isFeatured,
      category: {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
      },
    }));
  },
  ["featured-products"],
  {
    revalidate: 3600, // 1 hour background revalidation
    tags: [CACHE_TAGS.products],
  }
);

/**
 * Cached fetch of active categories with their active product counts
 */
export const getCachedActiveCategoriesWithCount = unstable_cache(
  async () => {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
      },
    });
  },
  ["active-categories-with-count"],
  {
    revalidate: 3600,
    tags: [CACHE_TAGS.categories, CACHE_TAGS.products],
  }
);

/**
 * Cached fetch of category list (for shop filter navigation)
 */
export const getCachedCategoryList = unstable_cache(
  async () => {
    return prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });
  },
  ["active-categories-list"],
  {
    revalidate: 3600,
    tags: [CACHE_TAGS.categories],
  }
);

/**
 * Cached fetch for product detail page by slug
 */
export const getCachedProductBySlug = (slug: string) => {
  return unstable_cache(
    async (): Promise<FullProduct | null> => {
      const dbProduct = await prisma.product.findUnique({
        where: { slug, isActive: true },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },
      });

      if (!dbProduct) return null;

      return {
        id: dbProduct.id,
        name: dbProduct.name,
        slug: dbProduct.slug,
        description: dbProduct.description,
        price: Number(dbProduct.price),
        stock: dbProduct.stock,
        mainImage: dbProduct.mainImage,
        category: {
          id: dbProduct.category.id,
          name: dbProduct.category.name,
          slug: dbProduct.category.slug,
        },
        images: dbProduct.images.map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          sortOrder: img.sortOrder,
        })),
      };
    },
    [`product-${slug}`],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.products, CACHE_TAGS.product(slug)],
    }
  )();
};

/**
 * Cached fetch for related products in the same category
 */
export const getCachedRelatedProducts = (categoryId: string, excludeProductId: string) => {
  return unstable_cache(
    async (): Promise<SerializedProduct[]> => {
      const relatedDbProducts = await prisma.product.findMany({
        where: {
          categoryId,
          isActive: true,
          id: { not: excludeProductId },
        },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      return relatedDbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        stock: p.stock,
        mainImage: p.mainImage,
        isFeatured: p.isFeatured,
        category: {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
        },
      }));
    },
    [`related-products-${categoryId}-${excludeProductId}`],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.products],
    }
  )();
};

/**
 * Cached fetch for shop page products with query keying
 */
export const getCachedShopProducts = (
  category?: string,
  search?: string,
  sort?: string
) => {
  const cacheKey = `shop-products-${category || "all"}-${search ? encodeURIComponent(search.trim()) : "none"}-${sort || "newest"}`;

  return unstable_cache(
    async (): Promise<SerializedProduct[]> => {
      const where: Prisma.ProductWhereInput = {
        isActive: true,
      };

      if (category) {
        where.category = {
          slug: category,
        };
      }

      if (search && search.trim().length > 0) {
        where.OR = [
          { name: { contains: search.trim(), mode: "insensitive" } },
          { description: { contains: search.trim(), mode: "insensitive" } },
        ];
      }

      let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
      if (sort === "price-asc") {
        orderBy = { price: "asc" };
      } else if (sort === "price-desc") {
        orderBy = { price: "desc" };
      } else if (sort === "name-asc") {
        orderBy = { name: "asc" };
      }

      const dbProducts = await prisma.product.findMany({
        where,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        stock: p.stock,
        mainImage: p.mainImage,
        isFeatured: p.isFeatured,
        category: {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
        },
      }));
    },
    [cacheKey],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.products],
    }
  )();
};
