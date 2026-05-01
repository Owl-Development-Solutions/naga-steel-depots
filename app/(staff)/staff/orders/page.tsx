import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Edit, Package, User, Calendar } from "lucide-react";

import { getAllOrders } from "@/lib/actions/order.actions";
import { formatDateTime } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OrderDetails from "@/components/order-details";
import EditOrderDetails from "@/components/edit-order-details";
import { getUserDriver } from "@/lib/actions/user.actions";
import Link from "next/link";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default async function OrdersUI(props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) {
  const { page = 1, query: searchText } = await props.searchParams;
  const orders = await getAllOrders({
    page: Number(page),
    // limit: 2,
    query: searchText,
  });

  const drivers = await getUserDriver();

  return (
    <main>
      <div className="flex gap-2 items-center mb-5 justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-blue-600 mr-3" />
          <h1 className="text-xl font-semibold">Order Management</h1>
        </div>

        {searchText && (
          <div>
            Filtered by <i>&quot;{searchText}&quot;</i>
            <Link href="/staff/orders">
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

      {/* List */}
      <div className="space-y-4">
        {orders.data.length ? (
          orders.data.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6 flex justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold mr-3">{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {order.user.name}
                    </div>

                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      {order.orderitems.length} items
                    </div>

                    <div className="flex items-center">
                      ₱ {order.totalPrice}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDateTime(order.createdAt).dateTime}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {/* <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button> */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="!max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                      </DialogHeader>

                      <OrderDetails orderId={order.id} type="read-only" />
                    </DialogContent>
                  </Dialog>

                  {/* <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button> */}
                  <EditOrderDetails
                    orderId={order.id}
                    currentStatus={order.status}
                    currentDriver={order.deliveryDriver}
                    drivers={drivers}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-gray-500 mb-4">
            No results for <span className="font-medium">"{searchText}"</span>
          </p>
        )}
      </div>
    </main>
  );
}
