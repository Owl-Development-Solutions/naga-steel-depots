import { requireStaff } from "@/lib/auth-guard";
import OrdersUI from "./orders-client-staff";

export default async function OrdersClientPage() {
  await requireStaff();

  return <OrdersUI />;
}
