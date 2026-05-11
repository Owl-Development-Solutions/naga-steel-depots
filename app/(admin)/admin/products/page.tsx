import { requireAdmin } from "@/lib/auth-guard";
import ProductsTablePage from "./products-table-page";

export default async function ProductsPage() {
  await requireAdmin();

  return <ProductsTablePage />;
}
