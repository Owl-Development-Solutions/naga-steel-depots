
import { requireAdmin } from "@/lib/auth-guard";
import ProductsClient from "./products-client";

export default async function ProductsPage() {
  await requireAdmin();

  return <ProductsClient />;
}
