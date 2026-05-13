"use client";

import { ColumnDef, FilterConfig } from "@/types/table-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Package, User, Truck, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OrderDetailsClient from "@/components/order-details-client";
import EditOrderDetails from "@/components/edit-order-details";
import { formatDate, StaffOrderRow } from "@/types";
import { formatCurrency } from "@/lib/utils";

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { bg: string; text: string; border: string }> =
    {
      pending: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
      },
      processing: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      shipped: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
      },
      delivered: {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
      },
      cancelled: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      },
    };

  const variant = variants[status.toLowerCase()] || variants.pending;

  return (
    <Badge
      className={`${variant.bg} ${variant.text} border ${variant.border} font-semibold px-2.5 py-0.5`}
      variant="outline"
    >
      {status}
    </Badge>
  );
};

const PaymentBadge = ({ isPaid }: { isPaid: boolean }) => {
  return isPaid ? (
    <Badge
      className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold"
      variant="outline"
    >
      Paid
    </Badge>
  ) : (
    <Badge
      className="bg-orange-50 text-orange-700 border border-orange-200 font-semibold"
      variant="outline"
    >
      Unpaid
    </Badge>
  );
};

const DeliveryBadge = ({ isDelivered }: { isDelivered: boolean }) => {
  return isDelivered ? (
    <Badge
      className="bg-green-50 text-green-700 border border-green-200 font-semibold"
      variant="outline"
    >
      Delivered
    </Badge>
  ) : (
    <Badge
      className="bg-gray-50 text-gray-700 border border-gray-200 font-semibold"
      variant="outline"
    >
      Pending
    </Badge>
  );
};

export const createStaffOrderColumns = (
  drivers: any[],
  onOrderUpdated?: () => void,
): ColumnDef<StaffOrderRow>[] => [
  {
    key: "id",
    label: "Order ID",
    className: "font-mono text-xs min-w-[100px]",
    render: (order) => (
      <div className="flex flex-col">
        <span className="text-slate-900 font-bold text-xs">
          #{order.id.slice(-8)}
        </span>
      </div>
    ),
  },
  {
    key: "user",
    label: "Customer",
    className: "min-w-[180px]",
    render: (order) => (
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-gray-400" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-900">
            {order.user?.name || "Guest"}
          </span>
          <span className="text-xs text-slate-500">{order.user.name}</span>
        </div>
      </div>
    ),
  },
  {
    key: "orderItems",
    label: "Items",
    className: "min-w-[100px]",
    render: (order) => (
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-gray-400" />
        <span className="text-sm">{order.orderitems?.length || 0} items</span>
      </div>
    ),
  },
  {
    key: "totalPrice",
    label: "Total",
    className: "min-w-[120px]",
    render: (order) => (
      <span className="text-sm font-bold text-green-600">
        {formatCurrency(Number(order.totalPrice))}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    className: "min-w-[110px]",
    render: (order) => <StatusBadge status={order.status!} />,
  },
  {
    key: "isPaid",
    label: "Payment",
    className: "min-w-[100px]",
    render: (order) => <PaymentBadge isPaid={Boolean(order.isPaid)} />,
  },
  {
    key: "isDelivered",
    label: "Delivery",
    className: "min-w-[110px]",
    render: (order) => (
      <DeliveryBadge isDelivered={Boolean(order.isDelivered)} />
    ),
  },
  {
    key: "deliveryDriver",
    label: "Driver",
    className: "min-w-[140px]",
    render: (order) => (
      <div className="flex items-center gap-2">
        {order.deliveryDriver ? (
          <>
            <Truck className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{order.deliveryDriver}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400">Not assigned</span>
        )}
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Date",
    className: "min-w-[140px]",
    render: (order) => (
      <div className="flex flex-col">
        <span className="text-xs text-slate-900">
          {formatDate(order.createdAt!)}
        </span>
      </div>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    className: "text-center min-w-[80px]",
    render: (order) => (
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DialogTrigger asChild>
              <DropdownMenuItem className="w-full cursor-pointer">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <EditOrderDetails
                orderId={order.id}
                currentStatus={order.status!}
                currentDriver={order.deliveryDriver || undefined}
                drivers={drivers}
                onOrderUpdated={onOrderUpdated}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="max-w-4xl! max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Details
            </DialogTitle>
          </DialogHeader>
          <OrderDetailsClient orderId={order.id} type="read-only" />
        </DialogContent>
      </Dialog>
    ),
  },
];

export const createStaffOrderFilters = (drivers: any[]): FilterConfig[] => [
  {
    key: "search",
    label: "Search",
    type: "search",
    placeholder: "Search by customer",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Processing", value: "processing" },
      { label: "Shipped", value: "shipped" },
      { label: "Delivered", value: "delivered" },
      { label: "Cancelled", value: "cancelled" },
    ],
  },
  {
    key: "payment",
    label: "Payment",
    type: "select",
    options: [
      { label: "Paid", value: "paid" },
      { label: "Unpaid", value: "unpaid" },
    ],
  },
  {
    key: "delivery",
    label: "Delivery",
    type: "select",
    options: [
      { label: "Delivered", value: "delivered" },
      { label: "Pending", value: "pending" },
    ],
  },
  {
    key: "driver",
    label: "Driver",
    type: "select",
    options: [
      { label: "Unassigned", value: "unassigned" },
      ...drivers.map((driver) => ({
        label: driver.name,
        value: driver.name,
      })),
    ],
  },
  {
    key: "date",
    label: "Order Date",
    type: "date",
  },
];
