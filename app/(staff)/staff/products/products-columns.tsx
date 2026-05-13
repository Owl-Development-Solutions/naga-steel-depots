"use client";

import { ColumnDef, FilterConfig } from "@/types/table-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Edit, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatDate, Product } from "@/types";
import { formatCurrency, formatId } from "@/lib/utils";
import Image from "next/image";

const StockLevelBadge = ({
  stock,
  threshold,
}: {
  stock: number;
  threshold: number;
}) => {
  const ratio = stock / threshold;

  let variant: {
    bg: string;
    text: string;
    border: string;
    label: string;
  };

  if (stock === 0) {
    variant = {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "Out of Stock",
    };
  } else if (ratio <= 0.3) {
    variant = {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "Low",
    };
  } else if (ratio <= 0.6) {
    variant = {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      label: "Medium",
    };
  } else {
    variant = {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      label: "Good",
    };
  }

  return (
    <Badge
      className={`${variant.bg} ${variant.text} border ${variant.border} font-semibold px-2.5 py-0.5`}
      variant="outline"
    >
      {variant.label}
    </Badge>
  );
};

export const productColumns: ColumnDef<Product>[] = [
  {
    key: "name",
    label: "Product",
    className: "min-w-[300px]",
    render: (product) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={100}
            height={100}
          />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate">
            {product.name}
          </div>
          <div className="text-xs text-gray-500">{formatId(product.id)}</div>
        </div>
      </div>
    ),
  },
  {
    key: "category",
    label: "Category",
    sortable: false,
    className: "min-w-[120px]",
    render: (product) => (
      <Badge variant="outline" className="bg-gray-50">
        {product.category?.name ?? "Uncategorized"}
      </Badge>
    ),
  },
  {
    key: "brand",
    label: "Brand",
    className: "min-w-[120px]",
    render: (product) => (
      <span className="text-sm text-gray-700">{product.brand}</span>
    ),
  },
  {
    key: "price",
    label: "Price",
    className: "text-right min-w-[120px]",
    render: (product) => (
      <span className="text-sm font-semibold text-gray-900">
        {formatCurrency(Number(product.price))}
      </span>
    ),
  },
  {
    key: "stock",
    label: "Stock Level",
    className: "text-center min-w-[150px]",
    render: (product) => {
      const isLowStock = Number(product.stock) <= 10;
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold ${
                Number(product.stock) === 0
                  ? "text-red-600"
                  : isLowStock
                    ? "text-yellow-600"
                    : "text-green-600"
              }`}
            >
              {product.stock}
            </span>
            <StockLevelBadge
              stock={Number(product.stock)}
              threshold={Number(product.lowStockThreshold)}
            />
          </div>
          {isLowStock && Number(product.stock) > 0 && (
            <div className="flex items-center text-xs text-red-600">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Low Stock
            </div>
          )}
        </div>
      );
    },
  },
  {
    key: "totalValue",
    label: "Total Value",
    sortable: false,
    className: "text-right min-w-[120px]",
    render: (product) => {
      const totalValue = Number(product.price) * Number(product.stock);
      return (
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(totalValue)}
        </span>
      );
    },
  },
  {
    key: "rating",
    label: "Rating",
    className: "text-center min-w-[100px]",
    render: (product) => (
      <div className="flex flex-col items-center">
        <span className="text-sm font-semibold text-gray-900">
          ⭐ {Number(product.rating).toFixed(1)}
        </span>
        <span className="text-xs text-gray-500">
          {product.numReviews} reviews
        </span>
      </div>
    ),
  },
  {
    key: "updatedAt",
    label: "Last Updated",
    className: "min-w-[140px]",
    render: (product) => (
      <div className="text-xs text-gray-600">
        {formatDate(product.updatedAt!)}
      </div>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    className: "text-center min-w-[100px]",
    render: (product) => (
      <Button size="sm" variant="outline" asChild>
        <Link href={`/staff/products/${product.id}`}>
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Link>
      </Button>
    ),
  },
];

// Filter configurations for products
export const productFilters: FilterConfig[] = [
  {
    key: "search",
    label: "Search",
    type: "search",
    placeholder: "Search by name, brand, or ID...",
  },
  {
    key: "category",
    label: "Category",
    type: "select",
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
