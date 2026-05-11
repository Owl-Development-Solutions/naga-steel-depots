import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";
import { ColumnDef } from "@/types/table-types";
import { Pencil, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function buildColumns(
  onDelete?: (id: string) => void,
): ColumnDef<Product>[] {
  return [
    {
      key: "id",
      label: "Product ID",
      className: "w-[120px]",
      render: (row) => (
        <span className="font-mono text-[11px] text-slate-400 truncate block max-w-[100px]">
          {row.id.slice(0, 8)}…
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-2.5 min-w-0">
          {row.images?.[0] && (
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
              <Image
                src={row.images[0]}
                alt={row.name}
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium text-slate-800 truncate max-w-[180px] text-sm">
              {row.name}
            </p>
            <p className="text-xs text-slate-400">{row.brand}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row) => (
        <Badge
          variant="outline"
          className="text-xs border-slate-200 text-slate-600 bg-slate-50"
        >
          {row.category?.name ?? "—"}
        </Badge>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <div className="space-y-0.5">
          <p
            className={`text-sm font-semibold ${row.promoPrice > 0 ? "line-through text-slate-400" : "text-slate-800"}`}
          >
            {formatCurrency(Number(row.price))}
          </p>
        </div>
      ),
    },
    {
      key: "promoPrice",
      label: "Promo Price",
      render: (row) =>
        row.promoPrice ? (
          <span className="text-sm font-medium text-emerald-600">
            {formatCurrency(Number(row.promoPrice))}
          </span>
        ) : (
          <span className="text-slate-300 text-sm">—</span>
        ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (row) => {
        const isLow = row.stock <= 10;
        const isOut = row.stock === 0;
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
              isOut
                ? "bg-red-50 text-red-700 border-red-200"
                : isLow
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {isOut ? "Out of stock" : `${row.stock} units`}
          </span>
        );
      },
    },
    {
      key: "rating",
      label: "Rating",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-slate-700">
            {Number(row.rating).toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">({row.numReviews})</span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => (
        <span className="text-xs text-slate-500 font-mono">
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "",
      render: (row) => (
        <div className="flex  items-end">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
            asChild
          >
            <Link href={`/admin/products/${row.id}`}>
              <Pencil className="w-3.5 h-3.5" />
            </Link>
          </Button>
          {/* <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(row.id);
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button> */}
        </div>
      ),
    },
  ];
}
