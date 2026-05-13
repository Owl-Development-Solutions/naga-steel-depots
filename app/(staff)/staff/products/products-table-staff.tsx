"use client";

import { Package, AlertTriangle, PackageOpen, TrendingUp } from "lucide-react";
import {
  getAllCategories,
  getAllProductsForStaff,
} from "@/lib/actions/product.actions";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DataTableFetchResult,
  DataTableFilters,
  FilterConfig,
} from "@/types/table-types";
import { DataTable } from "@/components/shared/data-table";
import { productColumns, productFilters } from "./products-columns";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProductsStaffTable = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [summary, setSummary] = useState({
    totalValue: 0,
    lowStockCount: 0,
    inStockCount: 0,
    outOfStockCount: 0,
  });

  const fetchProducts = async (
    filters: DataTableFilters,
    page: number,
    pageSize: number,
  ) => {
    return await getAllProductsForStaff({
      limit: pageSize,
      page,
      filters,
    });
  };

  useEffect(() => {
    const loadSummary = async () => {
      const res = await getAllProductsForStaff({
        page: 1,
        limit: 1,
        filters: {},
      });

      console.log(res.summary);

      if (res.summary) {
        setSummary(res.summary);
      }
    };

    const fetchCategories = async () => {
      try {
        const cats = await getAllCategories();
        setCategories(cats);

        const dynamicFilters: FilterConfig[] = [
          {
            key: "search",
            label: "Search",
            type: "search",
            placeholder: "Search by name, ",
          },
          {
            key: "category",
            label: "Category",
            type: "select",
            options: cats.map((cat: any) => ({
              label: cat.name,
              value: cat.id,
            })),
          },
          {
            key: "stockLevel",
            label: "Stock Level",
            type: "select",
            options: [
              { label: "Out of Stock", value: "out" },
              { label: "Low Stock", value: "low" },
              { label: "Medium Stock", value: "medium" },
              { label: "Good Stock", value: "good" },
            ],
          },
          {
            key: "featured",
            label: "Featured",
            type: "select",
            options: [
              { label: "Featured", value: "yes" },
              { label: "Not Featured", value: "no" },
            ],
          },
        ];

        setFilters(dynamicFilters);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
    loadSummary();
  }, []);
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.inStockCount + summary.outOfStockCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <PackageOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {summary.inStockCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {summary.lowStockCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(summary.totalValue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable<Product>
        Icon={Package}
        title="Product Inventory"
        description="Manage your product catalog and stock levels"
        columns={productColumns}
        filters={filters}
        fetchData={fetchProducts}
        rowKey={(product) => product.id}
        emptyMessage="No products found. Add your first product to get started!"
        pageSizeOptions={[10, 20, 50, 100]}
        defaultPageSize={20}
      />
    </div>
  );
};

export default ProductsStaffTable;
