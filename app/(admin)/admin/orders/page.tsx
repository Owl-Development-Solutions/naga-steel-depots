import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Download,
  Calendar,
  Package,
  CreditCard,
  SearchIcon,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth-guard";
import InfoCardDetails from "@/components/shared/infor-card";
import {
  deleteOrder,
  getAllOrders,
  getOrderCardDetails,
} from "@/lib/actions/order.actions";
import { auth } from "@/auth";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Suspense } from "react";
import OrdersTable from "./orders-table";
import TableSkeleton from "@/components/shared/table-skeleton";

const iconMap = {
  package: Package,
  calendar: Calendar,
  creditCard: CreditCard,
};

export default async function OrdersPage(props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) {
  await requireAdmin();
  const cardDetails = await getOrderCardDetails();

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
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cardDetails.data!.map((card, idx) => {
          const Icon = iconMap[card.icon as keyof typeof iconMap];

          return (
            <InfoCardDetails
              title={card.title}
              description={card.description}
              key={idx}
              icon={Icon}
              amount={card.amount}
            />
          );
        })}
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                A list of all recent orders including their status.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {searchText && (
                <div>
                  Filtered by <i>&quot;{searchText}&quot;</i>
                  <Link href="/admin/orders">
                    <Button
                      variant="outline"
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
        </CardHeader>
        <CardContent>
          <OrdersTable page={Number(page)} query={searchText || ""} />

          {orders.totalPages > 1 && (
            <Pagination
              page={Number(page) || 1}
              totalPages={orders?.totalPages}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
