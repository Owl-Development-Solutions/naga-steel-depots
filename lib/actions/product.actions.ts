"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMITS, PAGE_SIZE } from "../constants";
import { Prisma } from "../generated/prisma/client";
import { revalidatePath } from "next/cache";
import z from "zod";
import { insertProductSchema, updateProductSchema } from "../validator";
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
    const data = await prisma.product.findFirst({
      where: { id: productId },
    });

    return {
      success: true,
      data: convertToPlainObject(data),
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
  const categoryFilter =
    category && category !== "all"
      ? {
          category,
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
    data,
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

//create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    const session = await auth();
    const userId = session?.user?.id;

    const createdProduct = await prisma.product.create({ data: product });

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
    return { success: false, message: formatError(error) };
  }
}

//update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const session = await auth();
    const userId = session?.user?.id;

    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error("Product not found");

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

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
    return { success: false, message: formatError(error) };
  }
}

//get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
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
