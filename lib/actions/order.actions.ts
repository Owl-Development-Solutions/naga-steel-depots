"use server";

import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validator";
import { prisma } from "@/db/prisma";
import {
  CartItem,
  Order,
  OrderWithRelations,
  PaymentResult,
  ShippingAddress,
} from "@/types";
import {
  calcPrice,
  convertToPlainObject,
  formatError,
  formatNumber,
} from "../utils";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/client";
import { PAGE_SIZE } from "../constants";
import { sendPurchaseReceipt } from "@/emails";
import { createOrderPlacedNotification } from "./notification.actions";
import { createAuditLog } from "./audit.actions";
import { DataTableFilters } from "@/types/table-types";

//create order and create the order items
// export async function createOrder() {
//   try {
//     const session = await auth();
//     if (!session) throw new Error("User is not authenticated");

//     const cart = await getMyCart();
//     const userId = session?.user?.id;

//     if (!userId) throw new Error("User not found");

//     const user = await getUserById(userId);

//     if (!cart || cart.items.length === 0) {
//       return {
//         success: false,
//         message: "Your cart is empty",
//         redirectTo: "/cart",
//       };
//     }

//     if (!user.address) {
//       return {
//         success: false,
//         message: "No Shipping Address",
//         redirectTo: "/shipping-address",
//       };
//     }

//     if (!user.paymentMethod) {
//       return {
//         success: false,
//         message: "No payment method",
//         redirectTo: "/payment-method",
//       };
//     }

//     //create order object
//     const order = insertOrderSchema.parse({
//       userId: user.id,
//       shippingAddress: user.address,
//       paymentMethod: user.paymentMethod,
//       itemsPrice: cart.itemsPrice,
//       shippingPrice: cart.shippingPrice,
//       taxPrice: cart.taxPrice,
//       totalPrice: cart.totalPrice,
//     });

//     //create a transaction to create order and order items in database
//     const insertedOrderId = await prisma.$transaction(async (tx) => {
//       //create order
//       const insertedOrder = await tx.order.create({ data: order });

//       //create order items from the cart items
//       for (const item of cart.items as CartItem[]) {
//         await tx.orderItem.create({
//           data: {
//             ...item,
//             price: item.price,
//             orderId: insertedOrder.id,
//           },
//         });
//       }

//       //clear the cart
//       await tx.cart.update({
//         where: { id: cart.id },
//         data: {
//           items: [],
//           totalPrice: 0,
//           taxPrice: 0,
//           shippingPrice: 0,
//           itemsPrice: 0,
//         },
//       });

//       return insertedOrder.id;
//     });

//     if (!insertedOrderId) throw new Error("Order not created");

//     // Create notifications for staff and admin
//     await createOrderPlacedNotification({
//       orderId: insertedOrderId,
//       orderTotal: Number(cart.totalPrice),
//       customerName: user.name || "Customer",
//       placedByUserId: userId,
//     });

//     return {
//       success: true,
//       message: "Order created",
//       redirectTo: `/order/${insertedOrderId}`,
//     };
//   } catch (error) {
//     if (isRedirectError(error)) throw error;

//     return {
//       success: false,
//       message: formatError(error),
//     };
//   }
// }
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const cart = await getMyCart();
    const userId = session?.user?.id;

    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: "No Shipping Address",
        redirectTo: "/shipping-address",
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    const selectedSet = new Set(cart.itemSelected);
    const selectedItems = (cart.items as CartItem[]).filter((item) =>
      selectedSet.has(item.productId),
    );

    if (selectedItems.length === 0) {
      return {
        success: false,
        message: "No items selected",
        redirectTo: "/cart",
      };
    }

    const session2 = await auth();
    const userData = await getUserById(session2?.user?.id as string);
    const userAddress = (userData.address as ShippingAddress)?.city;
    const selectedPrices = calcPrice(selectedItems, userAddress);

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: selectedPrices.itemsPrice,
      shippingPrice: selectedPrices.shippingPrice,
      taxPrice: selectedPrices.taxPrice,
      totalPrice: selectedPrices.totalPrice,
    });

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: order });

      for (const item of selectedItems) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }

      const remainingItems = (cart.items as CartItem[]).filter(
        (item) => !selectedSet.has(item.productId),
      );

      const remainingPrices =
        remainingItems.length > 0
          ? calcPrice(remainingItems, userAddress)
          : { itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: 0 };

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: remainingItems,
          itemSelected: [],
          itemsPrice: remainingPrices.itemsPrice,
          shippingPrice: remainingPrices.shippingPrice,
          taxPrice: remainingPrices.taxPrice,
          totalPrice: remainingPrices.totalPrice,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");

    await createAuditLog({
      action: "CREATE",
      entity: "Order",
      entityId: insertedOrderId,
      entityName: `Order by ${user.name}`,
      metadata: {
        itemCount: selectedItems.length,
        totalPrice: selectedPrices.totalPrice,
        paymentMethod: user.paymentMethod,
        shippingAddress: (user.address as ShippingAddress)?.city,
      },
    });

    await createOrderPlacedNotification({
      orderId: insertedOrderId,
      orderTotal: Number(selectedPrices.totalPrice),
      customerName: user.name || "Customer",
      placedByUserId: userId,
    });

    return {
      success: true,
      message: "Order created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//get order by ID
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
}

export async function createPaypalOrder(orderId: string) {
  try {
    //get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      //create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      //update order with paypal order id
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: 0,
          },
        },
      });

      return {
        success: true,
        message: "Item order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function approvePaypalOrder(
  orderId: string,
  data: {
    orderID: string;
  },
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Error in Paypal payment");
    }

    //update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    await createAuditLog({
      action: "STATUS_CHANGE",
      entity: "Order",
      entityId: orderId,
      entityName: `Order #${orderId}`,
      changes: {
        isPaid: { old: false, new: true },
        paymentMethod: { old: null, new: "PayPal" },
      },
      metadata: {
        paypalOrderId: data.orderID,
        captureId: captureData.id,
      },
    });

    return {
      success: true,
      message: "Your order has been paid",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
    },
  });

  if (!order) throw new Error("Order not found");

  if (order.isPaid) throw new Error("Order is already paid");

  //transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    //iterate over products and update the stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    //set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
        status: "processing",
      },
    });
  });

  //get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  if (!updatedOrder) throw new Error("Order not found");

  sendPurchaseReceipt({
    order: {
      ...updatedOrder,
      shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
      paymentResult: updatedOrder.paymentResult as PaymentResult,
    },
  });

  await createAuditLog({
    action: "STATUS_CHANGE",
    entity: "Order",
    entityId: orderId,
    entityName: `Order #${orderId}`,
    changes: {
      isPaid: { old: false, new: true },
      paidAt: { old: null, new: new Date().toISOString() },
    },
    metadata: {
      paymentResult,
      customerEmail: updatedOrder.user.email,
      customerName: updatedOrder.user.name,
    },
  });
}

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

// get sales data and order summary
export async function getOrderSummary() {
  //get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  //calculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  //get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`
  SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM
  "Order" GROUP BY to_char("createdAt", 'MM/YY')
  `;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  //get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}

//get the total card details process, revenue for admin ...
export async function getOrderCardDetails() {
  try {
    const [totalOrders, pendingOrders, processingOrders, revenue] =
      await Promise.all([
        prisma.order.count(),

        prisma.order.count({
          where: {
            isPaid: false,
          },
        }),

        prisma.order.count({
          where: {
            paymentMethod: {
              in: ["Paypal", "Stripe"],
            },
            isPaid: false,
          },
        }),

        prisma.order.aggregate({
          _sum: {
            totalPrice: true,
          },
          where: {
            isPaid: true,
          },
        }),
      ]);

    const cardDetails = [
      {
        title: "Total Orders",
        icon: "package",
        amount: totalOrders.toString(),
        description: "Orders made",
        bgColor: "bg-primary",
      },
      {
        title: "Pending Orders",
        icon: "calendar",
        amount: pendingOrders.toString(),
        description: "Unpaid orders",
        bgColor: "bg-primary-secondary",
      },
      {
        title: "Processing",
        icon: "package",
        amount: processingOrders.toString(),
        description: "Online payment made (Unpaid)",
        bgColor: "bg-warning",
      },
    ];

    return {
      success: true,
      data: convertToPlainObject(cardDetails),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//get all orders
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
  status,
  payment,
  date,
}: {
  limit?: number;
  page: number;
  query?: string;
  status?: string;
  payment?: string;
  date?: string;
}) {
  const where: Prisma.OrderWhereInput = {};

  if (query && query !== "all") {
    where.user = {
      name: {
        contains: query,
        mode: "insensitive",
      },
    };
  }

  if (status) {
    where.status = status;
  }

  if (payment === "paid") {
    where.isPaid = true;
  }

  if (payment === "unpaid") {
    where.isPaid = false;
  }

  if (date) {
    const startDate = new Date(date);

    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    where.createdAt = {
      gte: startDate,
      lt: endDate,
    };
  }

  const data = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: { select: { name: true } },
      orderitems: { select: { product: true } },
    },
  });

  const dataCount = await prisma.order.count({
    where,
  });

  return {
    data: convertToPlainObject(data),
    totalPages: Math.ceil(dataCount / limit),
  };
}

//delete an order
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({
      where: { id },
    });

    await createAuditLog({
      action: "DELETE",
      entity: "Order",
      entityId: id,
      entityName: `Order #${id}`,
      metadata: { deletedFrom: "admin-panel" },
    });

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//update COD order to paid
export async function updateOrderToPaidCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Order marked as paid",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//update COD order to delivered
export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error("Order not found");

    if (!order.isPaid) throw new Error("Order is not paid");

    await prisma.order.updateManyAndReturn({
      where: {
        id: orderId,
      },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
        status: "delivered",
      },
    });

    await createAuditLog({
      action: "STATUS_CHANGE",
      entity: "Order",
      entityId: orderId,
      entityName: `Order #${orderId}`,
      changes: {
        isDelivered: { old: false, new: true },
        deliveredAt: { old: null, new: new Date().toISOString() },
      },
      metadata: { markedBy: "admin" },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Order has been marked delivered",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
  filters,
}: {
  limit?: number;
  page: number;
  filters?: DataTableFilters;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authorized");
  }

  // Build where clause based on filters
  const where: any = { userId };

  // Filter by status
  if (filters?.status && filters.status !== "all") {
    where.status = filters.status;
  }

  // Filter by payment status
  if (filters?.payment && filters.payment !== "all") {
    where.isPaid = filters.payment === "paid";
  }

  // Search by order ID
  if (filters?.search) {
    where.id = {
      contains: filters.search,
      mode: "insensitive",
    };
  }

  // Filter by date
  if (filters?.date) {
    const startDate = new Date(filters.date);
    const endDate = new Date(filters.date);
    endDate.setHours(23, 59, 59, 999);

    where.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  }

  // Build orderBy based on sort
  let orderBy: any = { createdAt: "desc" };

  if (filters?.sort && filters?.sortDir) {
    orderBy = { [filters.sort]: filters.sortDir };
  }

  const data = await prisma.order.findMany({
    where,
    orderBy,
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      orderitems: {
        include: {
          product: {
            select: {
              name: true,
              images: true,
            },
          },
        },
      },
    },
  });

  const formattedData = data.map((order) => ({
    ...order,
    shippingAddress: order.shippingAddress as Order["shippingAddress"],
    paymentResult: order.paymentResult as OrderWithRelations["paymentResult"],
  }));

  const dataCount = await prisma.order.count({ where });

  return {
    data: formattedData,
    totalPages: Math.ceil(dataCount / limit),
    total: dataCount,
  };
}
