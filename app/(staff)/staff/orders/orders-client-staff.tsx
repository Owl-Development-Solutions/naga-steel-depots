"use client";

import { useState, useEffect } from "react";
import { getAllOrdersForStaff } from "@/lib/actions/order.actions";
import { getUserDriver } from "@/lib/actions/user.actions";

import { DataTable } from "@/components/shared/data-table";
import { DataTableFetchResult, DataTableFilters } from "@/types/table-types";
import { ShoppingCart } from "lucide-react";
import {
  createStaffOrderColumns,
  createStaffOrderFilters,
} from "./orders-column";
import { StaffOrderRow } from "@/types";

export default function OrdersUI() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversData = await getUserDriver();
        setDrivers(driversData);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  const fetchOrders = async (
    filters: DataTableFilters,
    page: number,
    pageSize: number,
  ): Promise<DataTableFetchResult<StaffOrderRow>> => {
    const res = await getAllOrdersForStaff({
      page,
      limit: pageSize,
      filters,
    });

    return res;
  };

  const handleOrderUpdated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <DataTable<StaffOrderRow>
        key={refreshKey}
        Icon={ShoppingCart}
        title="Order Management"
        description="Manage and track all customer orders"
        columns={createStaffOrderColumns(drivers, handleOrderUpdated)}
        filters={createStaffOrderFilters(drivers)}
        fetchData={fetchOrders}
        rowKey={(order) => order.id}
        emptyMessage="No orders found"
        pageSizeOptions={[5, 10, 15, 20, 50]}
        defaultPageSize={10}
      />
    </div>
  );
}
