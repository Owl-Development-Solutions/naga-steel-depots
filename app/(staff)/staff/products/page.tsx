import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Edit, Search, AlertTriangle } from "lucide-react";
import { Metadata } from "next";
import { getAllProducts, getProductById } from "@/lib/actions/product.actions";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import Link from "next/link";
import { requireStaff } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Staff Products",
};

const getStockLevel = (current: number, threshold: number) => {
  const ratio = current / threshold;

  if (ratio <= 0.3) {
    return {
      label: "Low",
      color: "text-red-600 bg-red-100 border-red-200",
    };
  }

  if (ratio <= 0.6) {
    return {
      label: "Medium",
      color: "text-yellow-600 bg-yellow-100 border-yellow-200",
    };
  }

  return {
    label: "Good",
    color: "text-green-600 bg-green-100 border-green-200",
  };
};

export default async function ProductsUI(props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) {
  await requireStaff();
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";

  const productsData = await getAllProducts({
    query: searchText,
    page,
    category,
  });

  return (
    <main>
      <div className="flex gap-2 items-center mb-5 justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600 mr-3" />
          <h1 className="text-xl font-semibold text-gray-900">
            Product Records
          </h1>
        </div>

        {searchText && (
          <div>
            Filtered by <i>&quot;{searchText}&quot;</i>
            <Link href="/staff/products">
              <Button
                variant="destructive"
                size="sm"
                className="ml-3 cursor-pointer"
              >
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsData.data.length ? (
          productsData.data.map((product) => {
            const stockStatus = getStockLevel(
              Number(product.stock),
              Number(product.lowStockThreshold),
            );
            return (
              <Card key={product.id}>
                <CardHeader className="pb-3 flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-2">
                      {product.name}
                    </CardTitle>
                    <Badge className={stockStatus.color}>
                      {stockStatus.label} Stock
                    </Badge>
                  </div>

                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/staff/products/${product.id}`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span>{product.category}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span>{formatCurrency(Number(product.price))}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-bold">{product.stock} units</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Updated:</span>
                    <span>{formatDateTime(product.updatedAt).dateTime}</span>
                  </div>

                  {product.stock <= 10 && (
                    <div className="mt-2 p-2 bg-yellow-50 border rounded">
                      <p className="text-xs text-yellow-800">
                        <AlertTriangle className="inline w-3 h-3 mr-1" />
                        Low stock
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 mb-4">
            No results for <span className="font-medium">"{searchText}"</span>
          </p>
        )}
      </div>
    </main>
  );
}
