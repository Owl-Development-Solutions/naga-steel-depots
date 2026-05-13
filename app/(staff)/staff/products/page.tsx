import { Metadata } from "next";

import ProductsStaffTable from "./products-table-staff";
import { requireStaff } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Staff Products",
};

export default async function ProductsUI() {
  await requireStaff();
  return <ProductsStaffTable />;
}
