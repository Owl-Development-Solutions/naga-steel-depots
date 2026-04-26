import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import OrderDetailsTable from "./order-details-table";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const order = await getOrderById(id);

  if (!order) notFound();

  const session = await auth();

  const isUserAdmin = session?.user?.role === "admin";

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={isUserAdmin}
    />
  );
};

export default OrderDetailsPage;
