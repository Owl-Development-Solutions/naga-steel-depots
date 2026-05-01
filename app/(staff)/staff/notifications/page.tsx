import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  AlertTriangle,
  Package,
  ShoppingCart,
  Trash2,
  Mail,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductDetails from "@/components/product-details";
import {
  deleteNotification,
  getUserNotifications,
  markAllNotificationsAsRead,
} from "@/lib/actions/notification.actions";
import Link from "next/link";
import OrderDetails from "@/components/order-details";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "low_stock":
    case "restock_flagged":
      return <Package className="w-5 h-5 text-blue-600" />;
    case "order_placed":
      return <ShoppingCart className="w-5 h-5 text-green-600" />;
    case "product_created":
    case "product_updated":
      return <User className="w-5 h-5 text-purple-600" />;
    case "return_request":
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    default:
      return <Bell className="w-5 h-5 text-gray-600" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "low_stock":
    case "restock_flagged":
      return "bg-blue-50 border-blue-200";
    case "order_placed":
      return "bg-green-50 border-green-200";
    case "product_created":
    case "product_updated":
      return "bg-purple-50 border-purple-200";
    case "return_request":
      return "bg-red-50 border-red-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const getNotificationTitle = (type: string) => {
  const titles: Record<string, string> = {
    low_stock: "Low Stock Alert",
    restock_flagged: "Product Flagged for Restock",
    order_placed: "New Order Placed",
    product_created: "New Product Added",
    product_updated: "Product Updated",
    return_request: "Return Request",
  };
  return (
    titles[type] ||
    type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Fetch notifications from database
  const notifications = await getUserNotifications(session.user.id);

  const unreadCount = notifications.data?.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Notifications</h1>
          <p className="text-gray-500">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <form action={markAllNotificationsAsRead.bind(null, session.user.id)}>
          <Button type="submit" variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        </form>
      </div>

      <div className="divide-y flex flex-col gap-4">
        {notifications.data?.map((notification) => (
          <Card
            key={notification.id}
            className={`transition-colors ${
              !notification.isRead
                ? getNotificationColor(notification.type)
                : "bg-white"
            }`}
          >
            <CardContent className="p-4 flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-medium">
                    {notification.title ||
                      getNotificationTitle(notification.type)}
                  </h3>

                  {!notification.isRead && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      New
                    </Badge>
                  )}

                  <Badge variant="outline" className="text-xs bg-amber-300">
                    {notification.type.replace(/_/g, " ")}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-1">
                  {notification.message}
                </p>

                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {notification.link &&
                  ((notification.metadata as { productId?: string })
                    ?.productId ? (
                    // ✅ CASE 1: Has productId → use Dialog
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Product Details</DialogTitle>
                        </DialogHeader>

                        <ProductDetails
                          productId={
                            (notification.metadata as { productId: string })
                              .productId
                          }
                        />
                      </DialogContent>
                    </Dialog>
                  ) : (
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

                        <OrderDetails
                          orderId={
                            (notification.metadata as { orderId: string })
                              .orderId
                          }
                          type="readonly"
                        />
                      </DialogContent>
                    </Dialog>
                  ))}

                <form action={deleteNotification.bind(null, notification.id)}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
