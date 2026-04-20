"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Eye,
  Edit,
  Search,
  CheckCircle,
  AlertTriangle,
  Package,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";
import { FaPesoSign } from "react-icons/fa6";

const orders = [
  {
    id: "1",
    orderNumber: "ORD-2024-1234",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    itemsCount: 2,
    totalPrice: 624.35,
    status: "pending",
    createdAt: "2024-04-20",
    isPaid: false,
    isDelivered: false,
  },
  {
    id: "2",
    orderNumber: "ORD-2024-1235",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    itemsCount: 3,
    totalPrice: 504.78,
    status: "completed",
    createdAt: "2024-04-19",
    isPaid: true,
    isDelivered: true,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrdersUI() {
  return (
    <main>
      <div className="flex items-center gap-4 mb-5">
        <ShoppingCart className="w-6 h-6 text-blue-600 mr-3" />
        <h1 className="text-xl font-semibold">Order Management</h1>
      </div>

      {/* List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6 flex justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold mr-3">{order.orderNumber}</h3>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {order.customerName}
                  </div>

                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    {order.itemsCount} items
                  </div>

                  <div className="flex items-center">₱ {order.totalPrice}</div>
                </div>

                <div className="text-xs text-gray-500 mt-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {order.createdAt}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
