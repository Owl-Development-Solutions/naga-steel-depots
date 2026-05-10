import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Edit, Search, AlertTriangle, PackageOpen, TrendingUp, TrendingDown } from "lucide-react";
import { Metadata } from "next";
import { getAllProducts, getProductById } from "@/lib/actions/product.actions";
import { formatCurrency, formatDateTime, formatNumber, formatId } from "@/lib/utils";
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

      {/* Summary Cards - Simple & Clean */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{productsData.data.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <PackageOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {productsData.data.filter(p => Number(p.stock) > 10).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {productsData.data.filter(p => Number(p.stock) <= 10).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(
                    productsData.data.reduce((sum, p) => sum + (Number(p.price) * Number(p.stock)), 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Product Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 border-b">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700 w-[300px]">Product</TableHead>
                  <TableHead className="font-semibold text-gray-700">Category</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Price</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Stock Level</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Total Value</TableHead>
                  <TableHead className="font-semibold text-gray-700">Last Updated</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsData.data.length ? (
                  productsData.data.map((product) => {
                    const stockStatus = getStockLevel(
                      Number(product.stock),
                      Number(product.lowStockThreshold),
                    );
                    const totalValue = Number(product.price) * Number(product.stock);
                    const isLowStock = Number(product.stock) <= 10;
                    
                    return (
                      <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">ID: {formatId(product.id)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50">
                            {product.category?.name ?? "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-gray-900">
                          {formatCurrency(Number(product.price))}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                                {product.stock}
                              </span>
                              <Badge className={stockStatus.color}>
                                {stockStatus.label}
                              </Badge>
                            </div>
                            {isLowStock && (
                              <div className="flex items-center text-xs text-red-600">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Low Stock
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-gray-900">
                          {formatCurrency(totalValue)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {formatDateTime(product.updatedAt).dateTime}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/staff/products/${product.id}`}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <Package className="w-12 h-12 text-gray-400" />
                        <div>
                          <p className="text-gray-600 font-medium">No products found</p>
                          <p className="text-sm text-gray-500">
                            {searchText ? `No results for "${searchText}"` : "No products available"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
