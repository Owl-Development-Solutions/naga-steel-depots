import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  Bell,
  LogOut,
  Home,
  TrendingUp,
  DollarSign,
  MoreHorizontal,
  User,
} from "lucide-react";
import { FaPesoSign } from "react-icons/fa6";
import { requireStaff } from "@/lib/auth-guard";
import {
  getLowStockProducts,
  getRecentActivity,
  getStaffDashboardStats,
} from "@/lib/actions/staff.actions";
import {
  cn,
  formatCurrency,
  formatDateTime,
  getTitleBasedOnTime,
} from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { auth } from "@/auth";

export default async function StaffDashboard() {
  await requireStaff();

  const { data } = await getStaffDashboardStats();
  const lowStackData = await getLowStockProducts();

  const recentActivities = await getRecentActivity();

  const session = await auth();

  const userName = session?.user?.name;

  const getActivityColor = (type: string) => {
    switch (type) {
      case "restock":
        return "bg-green-100 text-green-800 border-green-200";
      case "new_order":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low_stock":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const ActivityItem = ({ activity }: { activity: any }) => {
    return (
      <div className="flex gap-3 items-start hover:bg-muted p-2 rounded-md transition">
        <div
          className={cn("p-2 rounded border", getActivityColor(activity.type))}
        >
          {getActivityIcon(activity.icon)}
        </div>

        <div className="flex-1">
          <p className="text-sm h1-bold">{activity.title}</p>
          <p className="text-sm text-muted-foreground">
            {activity.description}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDateTime(activity.timestamp).dateTime}
          </p>
        </div>
      </div>
    );
  };

  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case "shoppingCart":
        return <ShoppingCart className="w-8 h-8" />;
      case "package":
        return <Package className="w-8 h-8 " />;
      case "alert":
        return <AlertTriangle className="w-8 h-8 " />;
      default:
        return <Bell className="w-8 h-8 " />;
    }
  };

  return (
    <main className=" mx-auto ">
      <div className="flex items-center gap-4 mb-5">
        <Home className="w-6 h-6 text-blue-600 mr-3" />
        <h1 className="underline  decoration-[#1F4D72] text-xl font-semibold ">
          {getTitleBasedOnTime()}, {userName}
        </h1>
      </div>
      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">
                {data?.totalProducts?.current}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {data?.lowStock?.current}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">
                {data?.pendingOrders?.current}
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-yellow-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data?.revenue?.current?.toString() as string)}
              </p>
            </div>
            <FaPesoSign className="w-8 h-8 text-green-600" />
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Low Stock Alerts",
              icon: AlertTriangle,
              color: "red",
              link: "/staff/inventory",
            },
            {
              title: "Product Records",
              icon: Package,
              color: "blue",
              link: "/staff/products",
            },
            {
              title: "Pending Orders",
              icon: ShoppingCart,
              color: "yellow",
              link: "/staff/orders",
            },
            {
              title: "Staff Profile",
              icon: User,
              color: "green",
              link: "/staff/profile",
            },
          ].map((item, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <item.icon className="w-6 h-6 mr-3" />
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={item.link}> Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity */}
        <div className="lg:col-span-2 grid md:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activities</CardTitle>

              {/* See more trigger */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DialogTrigger>

                {/* Modal */}
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>All Activities</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 mt-4">
                    {recentActivities.data?.map((a) => (
                      <ActivityItem key={a.id} activity={a} />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {recentActivities.data?.slice(0, 3).map((a) => (
                <ActivityItem key={a.id} activity={a} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alert */}
      {/* <Alert className="mt-8 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You have {stats.lowStockItems} low stock items.
        </AlertDescription>
      </Alert> */}
    </main>
  );
}
