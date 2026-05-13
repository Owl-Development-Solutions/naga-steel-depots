import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { formatDate, Order, OrderTableType } from "@/types";
import { ColumnDef } from "@/types/table-types";
import { Eye } from "lucide-react";

// Status badge component
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

// Payment badge component
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

export const orderColumns: ColumnDef<OrderTableType>[] = [
  {
    key: "id",
    label: "Order ID",
    sortable: true,
    className: "font-mono text-xs min-w-[120px]",
    render: (order) => (
      <div className="flex flex-col">
        <span className="text-slate-900 font-bold">
          #{order.id.slice(0, 8).toUpperCase()}
        </span>
        {/* <span className="text-[10px] text-slate-400 mt-0.5">
          {order.trackingNumber || "No tracking"}
        </span> */}
      </div>
    ),
  },
  {
    key: "customer",
    label: "Customer",
    sortable: true,
    className: "min-w-[180px]",
    render: (order) => (
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-slate-900">
          {order.user?.name || "Guest"}
        </span>
      </div>
    ),
  },
  {
    key: "product",
    label: "Product",
    className: "min-w-[200px]",

    render: (order) => {
      const itemCount = order.orderitems?.length || 0;
      const firstItem = order.orderitems[0].product.name;

      return (
        <div className="flex flex-col">
          <span className="text-sm text-slate-900 font-medium truncate max-w-[180px]">
            {firstItem}
          </span>

          {itemCount > 1 && (
            <span className="text-xs text-slate-500 mt-0.5">
              +{itemCount - 1} more item
              {itemCount - 1 > 1 ? "s" : ""}
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "totalPrice",
    label: "Amount",
    sortable: true,
    className: "text-right min-w-[120px]",
    render: (order) => (
      <div className="flex flex-col items-end">
        <span className="text-sm font-bold text-slate-900">
          {formatCurrency(Number(order.totalPrice))}
        </span>
        <span className="text-[10px] text-slate-400 mt-0.5">
          {order.orderitems?.reduce(
            (sum, item) => sum + order.orderitems.length,
            0,
          ) || 0}{" "}
          items
        </span>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    className: "min-w-[120px]",
    render: (order) => <StatusBadge status={order.status} />,
  },
  {
    key: "isPaid",
    label: "Payment",
    sortable: true,
    className: "min-w-[100px]",
    render: (order) => (
      <div className="flex flex-col gap-1">
        <PaymentBadge isPaid={order.isPaid} />
        {order.isPaid && order.paidAt && (
          <span className="text-[10px] text-slate-400">
            {formatDateTime(order.paidAt).dateTime}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Date",
    sortable: true,
    className: "min-w-[120px]",
    render: (order) => (
      <div className="flex flex-col">
        <span className="text-sm text-slate-900">
          {formatDate(order.createdAt)}
        </span>
      </div>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    className: "text-center min-w-[100px]",
    render: (order) => (
      <Button
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `/order/${order.id}`;
        }}
      >
        <Eye className="w-3.5 h-3.5" />
        Details
      </Button>
    ),
  },
];
