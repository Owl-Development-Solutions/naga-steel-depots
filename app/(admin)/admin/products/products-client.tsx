"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { deleteProduct, getAllProducts } from "@/lib/actions/product.actions";
import { formatCurrency, formatId } from "@/lib/utils";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Package, Plus, Search } from "lucide-react";
import EmptyHistoryMessage from "@/components/shared/empty-history-message";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function ProductsClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Initialize from URL params
  useEffect(() => {
    const page = searchParams.get("page");
    const query = searchParams.get("query");
    const limit = searchParams.get("limit");

    if (page) setCurrentPage(Number(page));
    if (query) {
      setSearchQuery(query);
      setSearchInput(query);
    }
    if (limit) setCurrentLimit(Number(limit));
  }, [searchParams]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getAllProducts({
        query: searchQuery,
        page: currentPage,
        limit: currentLimit,
      });

      console.log("useeffect", productsData);

      setProducts(productsData.data);
      setTotalPages(productsData.totalPage);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update URL when parameters change
  const updateURL = (params: {
    page?: number;
    query?: string;
    limit?: number;
  }) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (params.page !== undefined) {
      newSearchParams.set("page", params.page.toString());
    }
    if (params.query !== undefined) {
      if (params.query) {
        newSearchParams.set("query", params.query);
      } else {
        newSearchParams.delete("query");
      }
    }
    if (params.limit !== undefined) {
      newSearchParams.set("limit", params.limit.toString());
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page, query: searchQuery, limit: currentLimit });
  };

  // Handle limit change
  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1); // Reset to first page
    updateURL({ page: 1, query: searchQuery, limit });
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
    updateURL({ page: 1, query, limit: currentLimit });
  };

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, currentLimit, searchQuery]);

  const paginationOptions = [5, 10, 15, 20];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-semibold">Products Management</h1>
            <p className="text-sm text-gray-600">
              Manage your product inventory and pricing
            </p>
          </div>
        </div>

        {/* <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full lg:w-auto"> */}
        {/* Search */}
        {/* <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-10"
            />
          </div> */}

        {/* Limit Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Show:</span>
          <Select
            value={currentLimit.toString()}
            onValueChange={(value) => handleLimitChange(Number(value))}
          >
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paginationOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
        {/* </div> */}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-700">
                Product ID
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Category
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Price
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Stock
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Rating
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Loading products...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length ? (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900">
                    {formatId(product.id)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500"></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {product.category?.name ?? "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          product.stock < 50
                            ? "text-red-600 font-medium"
                            : "text-gray-900"
                        }
                      >
                        {product.stock}
                      </span>
                      {product.stock < 50 && (
                        <Badge variant="destructive" className="text-xs">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-gray-700">
                        {product.rating || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Link href={`/admin/products/${product.id}`}>Edit</Link>
                      </Button>
                      <DeleteDialog
                        id={product.id}
                        action={deleteProduct as any}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <EmptyHistoryMessage
                    Icon={Package}
                    message={
                      searchQuery
                        ? `No products match "${searchQuery}"`
                        : "No records available in the product catalog"
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * currentLimit + 1} to{" "}
            {Math.min(currentPage * currentLimit, products.length)} of{" "}
            {products.length} products
          </div>
          <Pagination page={currentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
