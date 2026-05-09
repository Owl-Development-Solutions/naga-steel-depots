"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMITS, PAGE_SIZE } from "../constants";
import { Prisma } from "../generated/prisma/client";
import { revalidatePath } from "next/cache";
import z from "zod";
import {
  insertProductSchema,
  transformText,
  updateProductSchema,
} from "../validator";
import { auth } from "@/auth";
import { createProductUpdateNotification } from "./notification.actions";

//Get latest products
export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMITS,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
};

//Get single product
export const getProductBySlug = async (slug: string) => {
  return await prisma.product.findFirst({
    where: { slug },
  });
};

//get single product byt its ID
export async function getProductById(productId: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { id: productId },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return {
      success: true,
      data: convertToPlainObject(product),
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

export const getProductCardDetails = async () => {
  try {
    const [totalProducts, lowStockProducts, totalSales, revenue] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({
          where: {
            stock: {
              lte: 10,
            },
          },
        }),
        // Total Sales (sum of qty from OrderItem)
        prisma.orderItem.aggregate({
          _sum: {
            qty: true,
          },
        }),
        // Revenue (only paid orders)
        prisma.order.aggregate({
          _sum: {
            totalPrice: true,
          },
          where: {
            isPaid: true,
          },
        }),
      ]);

    const data = [
      {
        title: "Total Products",
        icon: "package",
        amount: totalProducts.toString(),
        description: "All products",
        bgColor: "bg-primary-secondary",
      },
      {
        title: "Low Stock",
        icon: "alertTriangle",
        amount: lowStockProducts.toString(),
        description: "Products ≤ 10 stock",
        bgColor: "bg-alert",
      },
      {
        title: "Total Sales",
        icon: "shoppingCart",
        amount: (totalSales._sum.qty || 0).toString(),
        description: "Items sold",
        bgColor: "bg-accent",
      },
      {
        title: "Revenue",
        icon: "creditCard",
        amount: `₱${(revenue._sum.totalPrice || 0).toLocaleString()}`,
        description: "Total paid sales",
        bgColor: "bg-primary",
      },
    ];

    return {
      success: true,
      data: convertToPlainObject(data),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  console.log(sort);

  //query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  //category filter
  const categoryFilter: Prisma.ProductWhereInput =
    category && category !== "all"
      ? {
          category: {
            name: {
              equals: category,
              mode: "insensitive",
            },
          },
        }
      : {};

  //price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  //rating filter
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
          ? { price: "desc" }
          : sort === "rating"
            ? { rating: "desc" }
            : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data: convertToPlainObject(data),
    totalPage: Math.ceil(dataCount / limit),
  };
}

//delete a product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    const session = await auth();
    const userId = session?.user?.id;

    const { categoryId, ...rest } = product;

    const productData = {
      ...rest,
      categoryId: categoryId,
      slug: transformText(product.name) as string,
    };

    const createdProduct = await prisma.product.create({ data: productData });

    // Create notification for other staff members
    if (userId) {
      await createProductUpdateNotification({
        productId: createdProduct.id,
        productName: createdProduct.name,
        action: "created",
        updatedByUserId: userId,
      });
    }

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    console.log(error);

    return { success: false, message: formatError(error) };
  }
}

// update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);

    const { categoryId, ...rest } = product;

    const productData = {
      ...rest,
      categoryId: categoryId,
      slug: transformText(rest.slug) as string,
    };

    const session = await auth();
    const userId = session?.user?.id;

    console.log(productData);

    const productExists = await prisma.product.findFirst({
      where: { id: rest.id },
    });

    if (!productExists) throw new Error("Product not found");

    const updatedProduct = await prisma.product.update({
      where: { id: rest.id },
      data: productData,
    });

    console.log("updatedProduct", updatedProduct);

    // Create notification for other staff members
    if (userId) {
      await createProductUpdateNotification({
        productId: updatedProduct.id,
        productName: updatedProduct.name,
        action: "updated",
        updatedByUserId: userId,
      });
    }

    if (session?.user?.role === "admin") {
      revalidatePath("/admin/products");
    } else {
      revalidatePath("/staff/products");
    }

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    console.log(error);

    return { success: false, message: formatError(error) };
  }
}

export async function getAllCategories() {
  const data = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      _count: {
        select: { products: true },
      },
    },
  });

  return data;
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findFirst({
    where: { id },
  });

  return category;
}

//get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return convertToPlainObject(data);
}
