import { Order, ShippingAddress } from "@/types";
import { Badge } from "@/components/ui/badge";
import { getOrderById } from "@/lib/actions/order.actions";
import { getUserDriver } from "@/lib/actions/user.actions";
import AssignDeliveryDriver from "./driver-assign-form";
import EditOrderDetails from "./edit-order-details";
import { formatDateTime } from "@/lib/utils";

const OrderDetails = async ({
  orderId,
  type,
}: {
  orderId: string;
  type?: string;
}) => {
  const data = await getOrderById(orderId);
  const driver = await getUserDriver();

  console.log(data);

  return (
    <div className="space-y-6 overflow-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Order #{data?.id}</h2>
        <p className="text-sm text-muted-foreground">
          {new Date(data!.createdAt).toLocaleString()}
        </p>
      </div>
      {/* Customer */}
      <div className="space-y-1">
        <h3 className="font-medium">Customer</h3>
        <p className="text-sm">{data?.user?.name}</p>
        <p className="text-sm text-muted-foreground">{data?.user?.email}</p>
      </div>
      {/* Status */}
      <div className="flex gap-3 flex-wrap">
        <Badge variant={data?.isPaid ? "default" : "secondary"}>
          {data?.isPaid ? "Paid" : "Unpaid"}
        </Badge>

        <Badge variant={data?.isDelivered ? "default" : "secondary"}>
          {data?.isDelivered ? "Delivered" : "Pending Delivery"}
        </Badge>
      </div>
      {/* Shipping Address */}
      <div>
        <h3 className="font-medium mb-1">Shipping Address</h3>
        <p className="text-sm text-muted-foreground">
          {(data?.shippingAddress as ShippingAddress).fullName}
        </p>
        <p className="text-sm text-muted-foreground">
          {(data?.shippingAddress as ShippingAddress).addressInformation},{" "}
          {(data?.shippingAddress as ShippingAddress).city}
        </p>
        <p className="text-sm text-muted-foreground">
          {(data?.shippingAddress as ShippingAddress).postalCode},{" "}
          {(data?.shippingAddress as ShippingAddress).country}
        </p>
      </div>
      {/* Items */}
      <div>
        <h3 className="font-medium mb-2">Items</h3>
        <div className="space-y-3">
          {data?.orderitems.map((item, i) => (
            <div key={i} className="flex justify-between text-sm border-b pb-2">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>₱{Number(item.price) * Number(item.qty)}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Pricing */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Items</span>
          <span>₱{data?.itemsPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₱{data?.shippingPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₱{data?.taxPrice}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-2">
          <span>Total</span>
          <span>₱{data?.totalPrice}</span>
        </div>
      </div>
      {/* Payment */}
      <div className="text-sm">
        <h3 className="font-medium">Payment Method</h3>
        <p className="text-muted-foreground">{data?.paymentMethod}</p>
      </div>

      <div className="flex justify-between border-t pt-2">
        <span className="text-sm text-muted-foreground">Status</span>
        <Badge
          variant={
            data?.status === "delivered"
              ? "default"
              : data?.status === "cancelled"
                ? "destructive"
                : data?.status === "shipped"
                  ? "secondary"
                  : "outline"
          }
        >
          {data?.status || "pending"}
        </Badge>
      </div>

      {data?.deliveryDriver ? (
        <>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm text-muted-foreground">
              Assigned Delivery Driver
            </span>
            <span className="text-sm">{data?.deliveryDriver}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm text-muted-foreground">
              Estimated Delivery Date
            </span>
            <span className="text-sm">
              {formatDateTime(data?.estimatedDelivery!).dateOnly}
            </span>
          </div>

          <div className="flex justify-between border-t pt-2">
            <span className="text-sm text-muted-foreground">
              Estimated Delivery Arrived
            </span>
            <span className="text-sm">
              {formatDateTime(data?.estimatedDeliveryEnd!).dateOnly}
            </span>
          </div>
        </>
      ) : (
        <AssignDeliveryDriver orderId={orderId} driver={driver} />
      )}

      {type === "update" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Order Management</h3>
            <EditOrderDetails
              orderId={data!.id}
              currentDriver={data?.deliveryDriver}
              currentStatus={data?.status || "pending"}
              drivers={driver as any[]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
