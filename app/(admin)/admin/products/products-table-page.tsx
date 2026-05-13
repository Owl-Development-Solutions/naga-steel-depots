"use client";

import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import { Product } from "@/types";
import {
  DataTableFilters,
  FilterConfig,
  PRICE_OPTIONS,
  RATING_OPTIONS,
  SORT_OPTIONS,
} from "@/types/table-types";
import { useEffect, useState } from "react";
import { buildColumns } from "./product-build-column";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Box, Icon, Plus } from "lucide-react";

export default function ProductsTablePage() {
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    getAllCategories().then((cats) =>
      setCategories(cats.map((c) => ({ label: c.name, value: c.name }))),
    );
  }, []);

  const filterConfigs: FilterConfig[] = [
    {
      key: "query",
      label: "Search",
      type: "search",
      placeholder: "Search products…",
    },
    { key: "category", label: "Category", type: "select", options: categories },
    { key: "price", label: "Price", type: "select", options: PRICE_OPTIONS },
    { key: "rating", label: "Rating", type: "select", options: RATING_OPTIONS },
    { key: "sort", label: "Sort by", type: "select", options: SORT_OPTIONS },
  ];

  async function fetchProducts(
    filters: DataTableFilters,
    page: number,
    pageSize: number,
  ) {
    const res = await getAllProducts({
      query: filters.query ?? "all",
      category: filters.category ?? "all",
      price: filters.price ?? "all",
      rating: filters.rating ?? "all",
      sort: filters.sort,
      page,
      limit: pageSize,
    });

    return {
      data: res.data as Product[],
      totalPages: res.totalPage,
      total: res.data.length,
    };
  }

  const columns = buildColumns((id) => {
    console.log("delete", id);
  });

  return (
    <div className="min-h-screen bg-slate-50/60 p-6">
      <div className="max-w-screen-xl mx-auto">
        <DataTable<Product>
          Icon={Box}
          title="Products"
          description="Manage your product catalog"
          columns={columns}
          filters={filterConfigs}
          fetchData={fetchProducts}
          rowKey={(row) => row.id}
          emptyMessage="No products found"
          headerActions={
            <Button
              size="sm"
              className="h-9 gap-2 bg-[#1F4F70] hover:bg-[#173c56]"
              asChild
            >
              <Link href="/admin/products/create">
                <Plus className="w-3.5 h-3.5" />
                Add Product
              </Link>
            </Button>
          }
        />
      </div>
    </div>
  );
}
