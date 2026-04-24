import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { deleteProduct, getAllProducts } from "@/lib/actions/product.actions";
import { formatCurrency, formatId } from "@/lib/utils";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";

const products = [
  {
    id: "PRD-001",
    name: "Carbon Steel Sheet",
    category: "Carbon Steel",
    price: "₱3,750",
    stock: 150,
    status: "active",
    sales: 234,
    revenue: "₱877,500",
    trend: "up",
  },
  {
    id: "PRD-002",
    name: "Stainless Steel Pipe",
    category: "Stainless Steel",
    price: "₱5,200",
    stock: 89,
    status: "active",
    sales: 189,
    revenue: "₱982,800",
    trend: "up",
  },
  {
    id: "PRD-003",
    name: "Steel Wire",
    category: "Steel Wire",
    price: "₱125",
    stock: 500,
    status: "active",
    sales: 156,
    revenue: "₱19,500",
    trend: "down",
  },
  {
    id: "PRD-004",
    name: "Carbon Steel Rod",
    category: "Carbon Steel",
    price: "₱2,450",
    stock: 75,
    status: "active",
    sales: 123,
    revenue: "₱301,350",
    trend: "up",
  },
  {
    id: "PRD-005",
    name: "Stainless Steel Sheet",
    category: "Stainless Steel",
    price: "₱6,800",
    stock: 45,
    status: "low-stock",
    sales: 98,
    revenue: "₱666,400",
    trend: "up",
  },
];

export default async function ProductsPage(props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";

  const productsData = await getAllProducts({
    query: searchText,
    page,
    category,
  });

  console.log(productsData);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and pricing
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button> */}
          <Button asChild size="sm">
            <Link href="/admin/products/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productsData.data.map((product) => (
            <TableRow
              key={product.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <TableCell className="font-medium">
                {formatId(product.id)}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.category}
                  </div>
                </div>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      product.stock < 50 ? "text-red-600 font-medium" : ""
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
              <TableCell>{product.rating}</TableCell>
              <TableCell className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/products/${product.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={product.id} action={deleteProduct as any} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {productsData.totalPage > 1 && (
        <Pagination
          page={page}
          totalPages={productsData.totalPage}
        ></Pagination>
      )}
    </div>
  );
}
