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
}: {
  orderId: string;
  driverId?: string;
  status?: string;
}) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    const updateData: {
      deliveryDriver?: string;
      driverPhone?: string;
      status?: string;
      estimatedDelivery?: Date;
      estimatedDeliveryEnd?: Date;
    } = {};

    // Update driver info if driverId is provided
    if (driverId) {
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
    }

    // Update status if provided
    if (status) {
      updateData.status = status;
    }

    await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    revalidatePath("/staff/orders");

    return { success: true, message: "Order has been updated" };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
