"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ShoppingCart, 
  Eye, 
  Edit, 
  Package, 
  User, 
  Calendar,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Truck
} from "lucide-react";

import { formatDateTime } from "@/lib/utils";
import OrderDetailsClient from "@/components/order-details-client";
import EditOrderDetails from "@/components/edit-order-details";

interface Order {
  id: string;
  status: string;
  user: {
    name: string;
  };
  orderitems: Array<{
    id: string;
    product?: any;
  }>;
  totalPrice: number;
  createdAt: string;
  deliveryDriver?: string;
  isPaid: boolean;
  isDelivered: boolean;
}

interface OrderManagementTableProps {
  orders: Order[];
  drivers: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  currentLimit: number;
  onSearch: (query: string) => void;
  searchQuery: string;
  onOrderUpdated?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPaymentStatusColor = (isPaid: boolean) => {
  return isPaid 
    ? "bg-green-100 text-green-800 border-green-200" 
    : "bg-orange-100 text-orange-800 border-orange-200";
};

const getDeliveryStatusColor = (isDelivered: boolean) => {
  return isDelivered 
    ? "bg-green-100 text-green-800 border-green-200" 
    : "bg-gray-100 text-gray-800 border-gray-200";
};

export default function OrderManagementTable({
  orders,
  drivers,
  currentPage,
  totalPages,
  onPageChange,
  onLimitChange,
  currentLimit,
  onSearch,
  searchQuery,
  onOrderUpdated,
}: OrderManagementTableProps) {
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    onSearch(value);
  };

  const paginationOptions = [5, 10, 15, 20];

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="h-8 w-8 p-0"
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="h-8 w-8 p-0"
          >
            {page}
          </Button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="h-8 w-8 p-0"
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold">Order Management</h1>
        </div>
        
        {/* <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full sm:w-auto"> */}
          {/* Search */}
          {/* <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div> */}
          
          {/* Limit Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Show:</span>
            <Select value={currentLimit.toString()} onValueChange={(value) => onLimitChange(Number(value))}>
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paginationOptions.map((limit) => (
                  <SelectItem key={limit} value={limit.toString()}>
                    {limit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        {/* </div> */}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Payment</TableHead>
              <TableHead className="font-semibold">Delivery</TableHead>
              <TableHead className="font-semibold">Driver</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">#{order.id.slice(-8)}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{order.user.name}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>{order.orderitems.length} items</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-semibold text-green-600">
                      ₱{order.totalPrice.toLocaleString()}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={`text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={`text-xs font-medium ${getPaymentStatusColor(order.isPaid)}`}>
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={`text-xs font-medium ${getDeliveryStatusColor(order.isDelivered)}`}>
                      {order.isDelivered ? "Delivered" : "Pending"}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.deliveryDriver ? (
                        <>
                          <Truck className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{order.deliveryDriver}</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">Not assigned</span>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDateTime(new Date(order.createdAt)).dateTime}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex justify-center">
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DialogTrigger asChild>
                              <DropdownMenuItem className="w-full cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <EditOrderDetails
                                orderId={order.id}
                                currentStatus={order.status}
                                currentDriver={order.deliveryDriver}
                                drivers={drivers}
                                onOrderUpdated={onOrderUpdated}
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <DialogContent className="!max-w-4xl max-h-[90vh]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Package className="w-5 h-5" />
                              Order Details
                            </DialogTitle>
                          </DialogHeader>
                          <OrderDetailsClient orderId={order.id} type="read-only" />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <ShoppingCart className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-500">No orders found</p>
                    {searchQuery && (
                      <p className="text-sm text-gray-400">
                        No results for "{searchQuery}"
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {orders.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            Showing {orders.length} of {totalPages * currentLimit} orders
          </div>
          {totalPages > 1 && renderPagination()}
        </div>
      )}
    </div>
  );
}
