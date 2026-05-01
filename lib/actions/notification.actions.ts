"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { getUserById } from "./user.actions";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Create a notification for a user
export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, string>;
  expiresAt?: Date;
  assignedDriver?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
        metadata: data.metadata,
        expiresAt: data.expiresAt,
      },
    });

    return {
      success: true,
      data: convertToPlainObject(notification),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get notifications for a user (for notifications page/table)
export async function getUserNotifications(
  userId: string,
  {
    limit = 50,
    includeRead = true,
  }: { limit?: number; includeRead?: boolean } = {},
) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(includeRead ? {} : { isRead: false }),
      },
      orderBy: [{ createdAt: "desc" }],
      take: limit,
    });

    return {
      success: true,
      data: convertToPlainObject(notifications),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return {
      success: true,
      message: "Notification marked as read",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(userId: string) {
  try {
    const user = await auth();
    const role = user?.user.role;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    if (role === "admin") {
      revalidatePath("/admin/notifications");
    }

    if (role === "staff") {
      revalidatePath("/staff/notifications");
    }
  } catch (error) {
    console.error(formatError(error));
  }
}

// Get unread notification count for a user
export async function getUnreadNotificationCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return {
      success: true,
      data: { count },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Delete a notification
export async function deleteNotification(notificationId: string) {
  try {
    const user = await auth();
    const role = user?.user.role;
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    if (role === "admin") {
      revalidatePath("/admin/notifications");
    }

    if (role === "staff") {
      revalidatePath("/staff/notifications");
    }
  } catch (error) {
    console.error(formatError(error));
  }
}

// Create notification when product is flagged for restock
export async function createRestockFlagNotificationByStaff(
  productId: string,
  productName: string,
  flaggedByUserId: string,
) {
  try {
    // Get admin users
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
      select: { id: true },
    });

    // Create notification for each admin
    const notifications = await Promise.all(
      admins.map((admin) =>
        prisma.notification.create({
          data: {
            userId: admin.id,
            type: "restock_flagged",
            title: "Product Flagged for Restock",
            message: `${productName} has been flagged for restock by staff.`,
            link: `/admin/products/${productId}`,
            metadata: { productId, flaggedBy: flaggedByUserId },
          },
        }),
      ),
    );

    return {
      success: true,
      data: { count: notifications.length },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Create notification when product is created or updated
export async function createProductUpdateNotification({
  productId,
  productName,
  action,
  updatedByUserId,
}: {
  productId: string;
  productName: string;
  action: "created" | "updated";
  updatedByUserId: string;
}) {
  try {
    //get user information
    const user = await getUserById(updatedByUserId);

    // Get staff users (excluding the one who made the change)
    const staffUsers = await prisma.user.findMany({
      where: { role: "staff" },
      select: { id: true },
    });

    const staffIds = staffUsers
      .filter((u) => u.id !== updatedByUserId)
      .map((u) => u.id);

    if (staffIds.length > 0) {
      await createNotificationForUsers({
        userIds: staffIds,
        type: action === "created" ? "product_created" : "product_updated",
        title: action === "created" ? "New Product Added" : "Product Updated",
        message: `${productName} has been ${action} by ${user.name}.`,
        link: `/staff/products/${productId}`,
        metadata: { productId, updatedBy: updatedByUserId },
      });
    }

    return {
      success: true,
      message: "Product update notifications created",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Helper: Create notification for multiple users
export async function createNotificationForUsers({
  userIds,
  type,
  title,
  message,
  link,
  metadata,
}: {
  userIds: string[];
  type: string;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type,
        title,
        message,
        link: link || null,
        metadata: metadata as Record<string, string>,
      })),
    });

    return {
      success: true,
      message: `Notifications sent to ${userIds.length} users`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Create notification when order is placed
export async function createOrderPlacedNotification({
  orderId,
  orderTotal,
  customerName,
  placedByUserId,
}: {
  orderId: string;
  orderTotal: number;
  customerName: string;
  placedByUserId: string;
}) {
  try {
    // Get staff users for delivery assignment notification
    const staffUsers = await prisma.user.findMany({
      where: { role: "staff" },
      select: { id: true },
    });

    // Get admin users for order notification
    const adminUsers = await prisma.user.findMany({
      where: { role: "admin" },
      select: { id: true },
    });

    // Filter out the user who placed the order if they have staff/admin role
    const staffIds = staffUsers
      .filter((u) => u.id !== placedByUserId)
      .map((u) => u.id);
    const adminIds = adminUsers
      .filter((u) => u.id !== placedByUserId)
      .map((u) => u.id);

    // Create notifications for staff (assign delivery rider)
    if (staffIds.length > 0) {
      await prisma.notification.createMany({
        data: staffIds.map((userId) => ({
          userId,
          type: "order_placed",
          title: "New Order - Assign Rider",
          message: `${customerName} placed an order (₱${orderTotal.toFixed(2)}). Please assign a delivery rider.`,
          link: `/staff/orders/${orderId}`,
          metadata: {
            orderId,
            customerName,
            orderTotal,
          },
        })),
      });
    }

    // Create notifications for admin (order placed notification)
    if (adminIds.length > 0) {
      await prisma.notification.createMany({
        data: adminIds.map((userId) => ({
          userId,
          type: "order_placed",
          title: "New Order Placed",
          message: `${customerName} placed an order worth ₱${orderTotal.toFixed(2)}.`,
          link: `/admin/orders/${orderId}`,
          metadata: { orderId, customerName, orderTotal },
        })),
      });
    }

    return {
      success: true,
      message: "Order notifications created",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
