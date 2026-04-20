import DeleteDialog from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";

const OrdersTable = async ({
  page,
  query,
}: {
  page: number;
  query: string;
}) => {
  const orders = await getAllOrders({ page, query });
  return (
    <>
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
          {orders.data.map((order) => (
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
                  ? formatDateTime(order.deliveredAt).dateTime
                  : "Not Delivered"}
              </TableCell>

              <TableCell>
                {order.isPaid && order.paidAt
                  ? formatDateTime(order.paidAt).dateTime
                  : "Not Paid"}
              </TableCell>

              <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>

              <TableCell>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/order/${order.id}`}>Details</Link>
                </Button>

                <DeleteDialog id={order.id} action={deleteOrder as any} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrdersTable;
