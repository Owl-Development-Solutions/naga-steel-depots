import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getOrderCardDetails,
  getOrderSummary,
} from "@/lib/actions/order.actions";
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
  getTitleBasedOnTime,
} from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  BadgeDollarSign,
  Barcode,
  Calendar,
  CreditCard,
  CreditCardIcon,
  Package,
  PhilippinePeso,
  ShieldIcon,
  ShoppingCart,
  UserPlus,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Charts from "./charts";
import { requireAdmin } from "@/lib/auth-guard";
import InfoCardDetails from "@/components/shared/info-card";
import { Button } from "@/components/ui/button";
import { getProductCardDetails } from "@/lib/actions/product.actions";
import { getUserCardDetails } from "@/lib/actions/user.actions";

const iconProductMap = {
  package: Package,
  alertTriangle: AlertTriangle,
  shoppingCart: ShoppingCart,
  creditCard: CreditCard,
};

const iconOrderMap = {
  package: Package,
  calendar: Calendar,
  creditCard: CreditCard,
};

const iconUserMap = {
  users: Users,
  activity: Activity,
  userPlus: UserPlus,
  shield: ShieldIcon,
};

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const AdminOverviewPage = async () => {
  await requireAdmin();
  const session = await auth();

  const userName = session?.user?.name;

  if (session?.user.role === " admin")
    throw new Error("User is not authorized");

  const summary = await getOrderSummary();
  const cardProductData = await getProductCardDetails();
  const cardOrderData = await getOrderCardDetails();
  const cardUserData = await getUserCardDetails();

  return (
    <div className="space-y-2">
      <div className="flex gap-4 items-center">
        <span className="underline  decoration-[#1F4D72] h2-bold">
          {getTitleBasedOnTime()}, {userName}
        </span>
      </div>
      <span>Here's the latest report</span>

      <div className="mt-3 grid md:grid-cols-2 lg:grid-cols-4">
        <InfoCardDetails
          title="Total Revenue"
          amount={formatCurrency(
            summary.totalSales._sum.totalPrice?.toString() || 0,
          )}
          icon={PhilippinePeso}
          bgColor="bg-primary"
        />

        <InfoCardDetails
          title="Sales"
          amount={formatNumber(summary.ordersCount)}
          icon={CreditCardIcon}
          bgColor="bg-green"
        />

        <InfoCardDetails
          title="Customers"
          amount={formatNumber(summary.usersCount)}
          icon={Users}
          bgColor="bg-primary-secondary"
        />

        <InfoCardDetails
          title="Products"
          amount={formatNumber(summary.productsCount)}
          icon={Barcode}
          bgColor="bg-light-teal"
        />
      </div>

      <div className="relative grid gap-4 md:grid-cols-2 kg:grid-cols-7 ">
        <Card className="cols-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>

        <Card className="cols-span-4">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BUYER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name ? order.user.name : "Deleted User"}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <span className="px-2">Details</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <span className=" flex text-center gap-3 h3-bold">Products</span>{" "}
        <span>Quick overview of your product inventory</span>
      </div>

      <Link href="/admin/products">
        <div className="mt-2 grid md:grid-cols-2 lg:grid-cols-4">
          {cardProductData.data!.map((card, idx) => {
            const Icon =
              iconProductMap[card.icon as keyof typeof iconProductMap];
            return (
              <InfoCardDetails
                title={card.title}
                description={card.description}
                key={idx}
                icon={Icon}
                amount={card.amount}
                bgColor={card.bgColor}
              />
            );
          })}
        </div>
      </Link>

      {/* Orders */}
      <div className="mt-10">
        <span className=" flex text-center gap-3 h3-bold">Orders</span>{" "}
        <span>Overview of recent orders and their status</span>
      </div>
      <Link href="/admin/orders">
        <div className="mt-2 grid md:grid-cols-2 lg:grid-cols-3">
          {cardOrderData.data!.map((card, idx) => {
            const Icon = iconOrderMap[card.icon as keyof typeof iconOrderMap];

            return (
              <InfoCardDetails
                title={card.title}
                description={card.description}
                key={idx}
                icon={Icon}
                amount={card.amount}
                bgColor={card.bgColor}
              />
            );
          })}
        </div>
      </Link>

      {/* Users */}
      <div className="mt-10">
        <span className=" flex text-center gap-3 h3-bold">Users</span>{" "}
        <span>Overview of users and their stats</span>
      </div>
      <Link href="/admin/users">
        <div className="mt-2 grid md:grid-cols-2 lg:grid-cols-4">
          {cardUserData.data!.map((card, idx) => {
            const Icon = iconUserMap[card.icon as keyof typeof iconUserMap];

            return (
              <InfoCardDetails
                title={card.title}
                description={card.description}
                key={idx}
                icon={Icon}
                amount={card.amount}
                bgColor={card.bgColor}
              />
            );
          })}
        </div>
      </Link>
    </div>
  );
};

export default AdminOverviewPage;
