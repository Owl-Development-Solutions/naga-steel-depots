"use client";

import { DataTable } from "@/components/shared/data-table";
import { ShoppingCart } from "lucide-react";
import { orderColumns } from "./order-build-columns";
import { DataTableFilters, FilterConfig } from "@/types/table-types";
import { useState } from "react";
import { getAllOrders, getMyOrders } from "@/lib/actions/order.actions";
import { OrderTableType } from "@/types";

const orderFilters: FilterConfig[] = [
  {
    key: "search",
    label: "Search",
    type: "search",
    placeholder: "Search by user...",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Processing", value: "processing" },
      { label: "Shipped", value: "shipped" },
      { label: "Delivered", value: "delivered" },
      { label: "Cancelled", value: "cancelled" },
    ],
  },
  {
    key: "payment",
    label: "Payment",
    type: "select",
    options: [
      { label: "Paid", value: "paid" },
      { label: "Unpaid", value: "unpaid" },
    ],
  },
  {
    key: "date",
    label: "Order Date",
    type: "date",
  },
];

const AdminOrderTablePage = () => {
  const fetchOrders = async (
    filters: DataTableFilters,
    page: number,
    pageSize: number,
  ) => {
    const result = await getAllOrders({
      page,
      limit: pageSize,
      query: filters.search ?? "all",
      status: filters.status,
      payment: filters.payment,
      date: filters.date,
    });

    return result;
  };
  return (
    <div className="min-h-screen bg-slate-50/60 p-6">
      <div className="max-w-7xl mx-auto">
        <DataTable<OrderTableType>
          Icon={ShoppingCart}
          title="My Orders"
          description="View and manage all your orders"
          columns={orderColumns}
          filters={orderFilters}
          fetchData={fetchOrders}
          rowKey={(order) => order.id}
          emptyMessage="No orders found."
          pageSizeOptions={[10, 20, 50, 100]}
          defaultPageSize={20}
        />
      </div>
    </div>
  );
};

export default AdminOrderTablePage;
