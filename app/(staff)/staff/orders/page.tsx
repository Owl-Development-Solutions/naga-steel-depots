"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllOrders } from "@/lib/actions/order.actions";
import { getUserDriver } from "@/lib/actions/user.actions";
import OrderManagementTable from "@/components/staff/order-management-table";

export default function OrdersUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getAllOrders({
        page: currentPage,
        limit: currentLimit,
        query: searchQuery,
      });
      setOrders(result.data);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const driversData = await getUserDriver();
      setDrivers(driversData);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, currentLimit, searchQuery]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    const page = searchParams.get("page");
    const query = searchParams.get("query");
    const limit = searchParams.get("limit");
    
    if (page) setCurrentPage(Number(page));
    if (query) setSearchQuery(query);
    if (limit) setCurrentLimit(Number(limit));
  }, [searchParams]);

  const updateURL = (params: { page?: number; query?: string; limit?: number }) => {
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
    
    router.push(`/staff/orders?${newSearchParams.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page });
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1); // Reset to first page when changing limit
    updateURL({ page: 1, limit });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    updateURL({ page: 1, query });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main>
      <OrderManagementTable
        orders={orders}
        drivers={drivers}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        currentLimit={currentLimit}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onOrderUpdated={fetchOrders}
      />
    </main>
  );
}
