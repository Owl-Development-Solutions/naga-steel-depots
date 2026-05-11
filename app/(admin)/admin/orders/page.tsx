import { requireAdmin } from "@/lib/auth-guard";
import { getMyOrders } from "@/lib/actions/order.actions";
import { auth } from "@/auth";
import AdminOrderTablePage from "./admin-order-table";

export default async function OrdersPage() {
  await requireAdmin();

  const session = await auth();

  if (session?.user?.role !== "admin") {
    throw new Error("User is not authorized");
  }

  return <AdminOrderTablePage />;
}
