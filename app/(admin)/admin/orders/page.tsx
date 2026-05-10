import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { requireAdmin } from "@/lib/auth-guard";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { auth } from "@/auth";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import DeleteDialog from "@/components/shared/delete-dialog";
import EmptyHistoryMessage from "@/components/shared/empty-history-message";

export default async function OrdersPage(props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) {
  await requireAdmin();

  const { page = 1, query: searchText } = await props.searchParams;

  const session = await auth();

  if (session?.user?.role !== "admin") {
    throw new Error("User is not authorized");
  }

  const orders = await getAllOrders({
    page: Number(page),
    // limit: 2,
    query: searchText,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button> */}
          {searchText && (
            <div>
              Filtered by <i>&quot;{searchText}&quot;</i>
              <Link href="/admin/orders">
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-3 cursor-pointer"
                >
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.data.length ? (
            orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>
                  {order.orderitems.map((prod) => (
                    <span key={prod.product.slug}>{prod.product.name}</span>
                  ))}
                </TableCell>

                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>

                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? `Delivered at ${formatDateTime(order.deliveredAt).dateTime}`
                    : "Not Delivered"}
                </TableCell>

                <TableCell>
                  {order.isPaid && order.paidAt
                    ? `Paid at ${formatDateTime(order.paidAt).dateTime}`
                    : "Not Paid"}
                </TableCell>

                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>

                <TableCell className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>

                  <DeleteDialog id={order.id} action={deleteOrder as any} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9999} className="h-75">
                <EmptyHistoryMessage
                  Icon={ShoppingCart}
                  message="No records available in the order catalog"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {orders.totalPages > 1 && orders.data.length > 0 && (
        <Pagination page={Number(page) || 1} totalPages={orders?.totalPages} />
      )}
    </div>
  );
}
