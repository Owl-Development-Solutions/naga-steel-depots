"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMITS } from "../constants";

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
