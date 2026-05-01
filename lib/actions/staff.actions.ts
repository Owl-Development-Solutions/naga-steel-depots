"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/client";
import { auth } from "@/auth";
import { getUserById } from "./user.actions";
import { createRestockFlagNotificationByStaff } from "./notification.actions";
import { PAGE_SIZE } from "../constants";

//STAFF FUNCTIONALITY  GOES HERE FILE JUST SEPARATED FOR VERCEL TIER FREE CAPACITY

// get dashboard stats - total products, low stock, pending orders, revenue
export async function getStaffDashboardStats() {
  try {
    const now = new Date();

    // Get current stats
    const [
      totalProducts,
      lowStockProducts,
      pendingOrders,
      revenue,
      // For comparisons
      productsLastMonth,
      ordersLastMonth,
      revenueLastMonth,
    ] = await Promise.all([
      // Current total products
      prisma.product.count(),

      // Low stock products (stock <= 10)
      prisma.product.count({
        where: { stock: { lte: 10 } },
      }),

      // Pending orders (not paid)
      prisma.order.count({
        where: { isPaid: false },
      }),

      // Total revenue (paid orders)
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { isPaid: true },
      }),

      // Products count last month
      prisma.product.count({
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            lt: new Date(now.getFullYear(), now.getMonth(), 1),
          },
        },
      }),

      // Orders count last month
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            lt: new Date(now.getFullYear(), now.getMonth(), 1),
          },
        },
      }),

      // Revenue last month
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          isPaid: true,
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            lt: new Date(now.getFullYear(), now.getMonth(), 1),
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalProducts: {
          current: totalProducts,
          change:
            productsLastMonth > 0
              ? ((totalProducts - productsLastMonth) / productsLastMonth) * 100
              : 0,
        },
        lowStock: {
          current: lowStockProducts,
          alert: lowStockProducts > 0,
        },
        pendingOrders: {
          current: pendingOrders,
          change:
            ordersLastMonth > 0
              ? ((pendingOrders - ordersLastMonth) / ordersLastMonth) * 100
              : 0,
        },
        revenue: {
          current: Number(revenue._sum.totalPrice || 0),
          change:
            revenueLastMonth._sum.totalPrice &&
            Number(revenueLastMonth._sum.totalPrice) > 0
              ? ((Number(revenue._sum.totalPrice || 0) -
                  Number(revenueLastMonth._sum.totalPrice)) /
                  Number(revenueLastMonth._sum.totalPrice)) *
                100
              : 0,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// get recent activity feed for dashboard
export async function getRecentActivity(limit = 10) {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
      include: {
        user: { select: { name: true } },
        orderitems: {
          take: 1,
          include: { product: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Get low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 10 } },
      orderBy: { stock: "asc" },
      take: 5,
    });

    // Get recently updated products (restocks)
    const recentlyUpdatedProducts = await prisma.product.findMany({
      where: {
        updatedAt: { gte: sevenDaysAgo },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    // Build activity feed
    const activities: Array<{
      id: string;
      type: "new_order" | "low_stock" | "restock" | "new_product";
      title: string;
      description: string;
      timestamp: Date;
      icon: string;
      bgColor: string;
    }> = [];

    // Add new orders
    for (const order of recentOrders) {
      const productName =
        order.orderitems[0]?.product?.name || "Multiple products";
      activities.push({
        id: `order-${order.id}`,
        type: "new_order",
        title: "New Order Received",
        description: `${order.user?.name || "Customer"} ordered ${productName}`,
        timestamp: order.createdAt,
        icon: "shoppingCart",
        bgColor: "bg-primary",
      });
    }

    // Add low stock alerts
    for (const product of lowStockProducts) {
      activities.push({
        id: `lowstock-${product.id}`,
        type: "low_stock",
        title: "Low Stock Alert",
        description: `${product.name} - only ${product.stock} units left`,
        timestamp: product.updatedAt,
        icon: "alertTriangle",
        bgColor: "bg-alert",
      });
    }

    // Add restock activities
    for (const product of recentlyUpdatedProducts) {
      // Only show as restock if stock increased (simplified logic)
      if (product.stock > 10) {
        activities.push({
          id: `restock-${product.id}`,
          type: "restock",
          title: "Product Restocked",
          description: `${product.name} - ${product.stock} units available`,
          timestamp: product.updatedAt,
          icon: "package",
          bgColor: "bg-green",
        });
      }
    }

    // Sort by timestamp and limit
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      success: true,
      data: convertToPlainObject(activities.slice(0, limit)),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get low stock monitoring data with summary stats
export async function getLowStockMonitoring({ query }: { query: string }) {
  try {
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

    const allLowStockProducts = await prisma.product.findMany({
      where: {
        stock: { lte: prisma.product.fields.lowStockThreshold },
      },
    });

    // Get all products that are at or below their threshold
    const lowStockProducts = await prisma.product.findMany({
      where: {
        ...queryFilter,
        stock: { lte: prisma.product.fields.lowStockThreshold },
      },
      orderBy: [{ stock: "asc" }],
    });

    const totalItems = allLowStockProducts.length;

    const critical = allLowStockProducts.filter(
      (p) => p.stock <= p.lowStockThreshold * 0.3,
    ).length;

    const flagged = allLowStockProducts.filter((p) => p.isFlagged).length;

    console.log("lowStockProducts", lowStockProducts);

    return {
      success: true,
      data: {
        summary: {
          totalItems,
          critical,
          flagged,
        },
        products: convertToPlainObject(
          lowStockProducts.map((product) => {
            return {
              id: product.id,
              productName: product.name,
              currentStock: product.stock,
              threshold: product.lowStockThreshold,
              category: product.category,
              lastUpdated: product.updatedAt,
              isFlagged: product.isFlagged,
              image: product.images[0],
            };
          }),
        ),
      },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get low stock monitoring with search and pagination
export async function getLowStockProducts({
  query = "",
  limit = 20,
}: {
  query?: string;
  limit?: number;
} = {}) {
  try {
    const queryFilter: Prisma.ProductWhereInput =
      query && query !== ""
        ? {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          }
        : {};

    const products = await prisma.product.findMany({
      where: {
        ...queryFilter,
        stock: { lte: prisma.product.fields.lowStockThreshold },
      },
      orderBy: [{ stock: "asc" }],
      take: limit,
    });

    return {
      success: true,
      data: convertToPlainObject(
        products.map((product) => ({
          id: product.id,
          productName: product.name,
          currentStock: product.stock,
          threshold: product.lowStockThreshold,
          category: product.category,
          lastUpdated: product.updatedAt,
          isFlagged: product.isFlagged,
        })),
      ),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Flag a product for admin notification
export async function flagProductForRestock(productId: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    const session = await auth();
    const userId = session?.user?.id;

    await prisma.product.update({
      where: { id: productId },
      data: { isFlagged: true },
    });

    // Create notification for other staff members
    if (userId) {
      await createRestockFlagNotificationByStaff(
        productId,
        product.name,
        userId,
      );
    }

    revalidatePath("/admin/low-stock");

    return {
      success: true,
      message: `${product.name} has been flagged for restock notification`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Unflag a product (after admin has been notified or restocked)
export async function unflagProduct(productId: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    await prisma.product.update({
      where: { id: productId },
      data: { isFlagged: false },
    });

    revalidatePath("/staff/inventory");

    return {
      success: true,
      message: `${product.name} has been unflagged`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update product stock threshold ==> will be used in editing product-form in staff
export async function updateProductThreshold(
  productId: string,
  threshold: number,
) {
  try {
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    await prisma.product.update({
      where: { id: productId },
      data: { lowStockThreshold: threshold },
    });

    //update tbis
    revalidatePath("/admin/low-stock");

    return {
      success: true,
      message: `${product.name} threshold updated to ${threshold}`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Restock product (add stock and optionally unflag)
export async function restockProduct(
  productId: string,
  quantity: number,
  unflag = true,
) {
  try {
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    if (quantity <= 0) throw new Error("Quantity must be positive");

    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: { increment: quantity },
        ...(unflag ? { isFlagged: false } : {}),
      },
    });

    revalidatePath("/staff/low-stock");
    revalidatePath("/staff/products");

    return {
      success: true,
      message: `${product.name} restocked with ${quantity} units. New stock: ${product.stock + quantity}`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get critical stock alert (for dashboard/header)
export async function getCriticalStockAlert() {
  try {
    //query filter

    // Products at or below 30% of threshold
    const criticalProducts = await prisma.product.findMany({
      where: {
        stock: { lte: prisma.product.fields.lowStockThreshold },
      },
    });

    const critical = criticalProducts.filter(
      (p) => p.stock <= p.lowStockThreshold * 0.3,
    );

    return {
      success: true,
      data: {
        hasCritical: critical.length > 0,
        criticalCount: critical.length,
        criticalProducts: convertToPlainObject(
          critical.map((p) => ({
            id: p.id,
            name: p.name,
            currentStock: p.stock,
            threshold: p.lowStockThreshold,
          })),
        ),
      },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
