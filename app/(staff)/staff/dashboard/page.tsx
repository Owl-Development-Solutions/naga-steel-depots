"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  Bell,
  LogOut,
  Home,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { FaPesoSign } from "react-icons/fa6";

const stats = {
  totalProducts: 156,
  lowStockItems: 8,
  pendingOrders: 23,
  totalRevenue: 45678.9,
};

const recentActivity = [
  {
    id: "1",
    type: "alert",
    message: "Low stock detected for Carbon Steel Sheets (5 units remaining)",
    timestamp: "2 minutes ago",
    severity: "high",
  },
  {
    id: "2",
    type: "order",
    message: "New order #1234 received - Processing",
    timestamp: "15 minutes ago",
    severity: "medium",
  },
  {
    id: "3",
    type: "stock",
    message: "Stainless Steel Pipes restocked - 50 units added",
    timestamp: "1 hour ago",
    severity: "low",
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "alert":
      return <AlertTriangle className="w-4 h-4" />;
    case "order":
      return <ShoppingCart className="w-4 h-4" />;
    case "stock":
      return <Package className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

export default function StaffDashboard() {
  return (
    <main className=" mx-auto ">
      <div className="flex items-center gap-4 mb-5">
        <Home className="w-6 h-6 text-blue-600 mr-3" />
        <h1 className="text-xl font-semibold">Staff Dashboard</h1>
      </div>
      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.lowStockItems}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pendingOrders}
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-yellow-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ₱{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <FaPesoSign className="w-8 h-8 text-green-600" />
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Low Stock Alerts",
              icon: AlertTriangle,
              color: "red",
            },
            {
              title: "Product Records",
              icon: Package,
              color: "blue",
            },
            {
              title: "Pending Orders",
              icon: ShoppingCart,
              color: "yellow",
            },
            {
              title: "Analytics",
              icon: TrendingUp,
              color: "green",
            },
          ].map((item, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <item.icon className="w-6 h-6 mr-3" />
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <Button variant="outline" className="w-full">
                  Open
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity */}
        <Card>
          <CardContent className="p-6 space-y-4">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className={`p-2 rounded ${getSeverityColor(a.severity)}`}>
                  {getActivityIcon(a.type)}
                </div>
                <div>
                  <p className="text-sm">{a.message}</p>
                  <p className="text-xs text-gray-500">{a.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alert */}
      <Alert className="mt-8 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You have {stats.lowStockItems} low stock items.
        </AlertDescription>
      </Alert>
    </main>
  );
}
