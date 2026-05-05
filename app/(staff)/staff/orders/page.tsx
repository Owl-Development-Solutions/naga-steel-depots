import { requireAdmin } from "@/lib/auth-guard";
import OrdersUI from "./orders-client-staff";

export default async function OrdersClientPage() {
  await requireAdmin();

  return <OrdersUI />;
}
