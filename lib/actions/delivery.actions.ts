"use server";

import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { calculateDelivery } from "../helpers/estimated-delvery";
import { getUserById } from "./user.actions";
import { ShippingAddress } from "@/types";
import { formatError } from "../utils";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}

export async function assignDriverAndUpdateOrder(
  orderId: string,
  driverId: string,
) {
  try {
    const data = await getUserById(driverId);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    const address = order.shippingAddress as {
      city: string;
    };

    const { shippingPrice, estimatedDeliveryStart, estimatedDeliveryEnd } =
      calculateDelivery({
        city: address.city,
      });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryDriver: (data.address as ShippingAddress).fullName,
        driverPhone: data.phoneNumber,
        estimatedDelivery: estimatedDeliveryStart,
        estimatedDeliveryEnd,
        status: "shipped",
      },
    });

    revalidatePath("/staff/orders");
    revalidatePath(`/staff/orders/${orderId}`);

    return { success: true, data: "Order has been updated" };
  } catch (error) {
    console.log("error ===>", error);

    return {
      success: false,
      message: "Failed to update order",
    };
  }
}

export async function updateOrderStatusAndDriver({
  orderId,
  driverId,
  status,
  trackingNumber,
  carrier,
  notes,
}: {
  orderId: string;
  driverId?: string;
  status?: string;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
}) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    const updateData: {
      deliveryDriver?: string | null;
      driverPhone?: string | null;
      status?: string;
      estimatedDelivery?: Date;
      estimatedDeliveryEnd?: Date;
      trackingNumber?: string | null;
      carrier?: string | null;
      notes?: string | null;
      deliveredAt?: Date;
      cancelledAt?: Date;
    } = {};

    // Update driver info if driverId is provided and not "none"
    if (driverId && driverId !== "none") {
      const driver = await getUserById(driverId);
      const address = order.shippingAddress as { city: string };

      updateData.deliveryDriver = (driver.address as ShippingAddress).fullName;
      updateData.driverPhone = driver.phoneNumber || undefined;

      // Calculate estimated delivery if address exists
      if (address?.city) {
        const { estimatedDeliveryStart, estimatedDeliveryEnd } =
          calculateDelivery({ city: address.city });
        updateData.estimatedDelivery = estimatedDeliveryStart;
        updateData.estimatedDeliveryEnd = estimatedDeliveryEnd;
      }
    } else if (driverId === "none") {
      // Clear driver assignment if "none" is selected
      updateData.deliveryDriver = null;
      updateData.driverPhone = null;
    }

    // Update status if provided
    if (status) {
      updateData.status = status;
      
      // Auto-update deliveredAt when status is set to delivered
      if (status === "delivered") {
        updateData.deliveredAt = new Date();
      }
      
      // Auto-update cancelledAt when status is set to cancelled
      if (status === "cancelled") {
        updateData.cancelledAt = new Date();
      }
    }

    // Update tracking information
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber || null;
    }

    if (carrier !== undefined) {
      updateData.carrier = carrier || null;
    }

    // Update notes
    if (notes !== undefined) {
      updateData.notes = notes || null;
    }

    await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    revalidatePath("/staff/orders");
    revalidatePath(`/staff/orders/${orderId}`);

    return { success: true, message: "Order has been updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
