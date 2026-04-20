"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";  
import { 
  Package,  
  ShoppingCart, 
  AlertTriangle, 
  Bell, 
  LogOut, 
  Home,
  TrendingUp,
  Users,
  DollarSign
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  pendingOrders: number;
  totalRevenue: number;
}

interface RecentActivity {
  id: string;
  type: "order" | "stock" | "alert";
  message: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
}

export default function StaffDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const session = localStorage.getItem("staffSession");
    if (!session) {
      router.push("/Staff/login");
      return;
    }

    // Load dashboard data
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    // Simulate API call with demo data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStats({
      totalProducts: 156,
      lowStockItems: 8,
      pendingOrders: 23,
      totalRevenue: 45678.90,
    });

    setRecentActivity([
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
      {
        id: "4",
        type: "alert",
        message: "Low stock alert for Welding Wires (8 units remaining)",
        timestamp: "2 hours ago",
        severity: "medium",
      },
    ]);

    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("staffSession");
    router.push("/Staff/login");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertTriangle className="w-4 h-4" />;
      case "order": return <ShoppingCart className="w-4 h-4" />;
      case "stock": return <Package className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Staff Dashboard</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <Card className="transform scale-105">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <Package className="w-10 h-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="transform scale-105">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-600">Low Stock Items</p>
                  <p className="text-3xl font-bold text-red-600">{stats.lowStockItems}</p>
                </div>
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="transform scale-105">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-600">Pending Orders</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <ShoppingCart className="w-10 h-10 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="transform scale-105">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-10 h-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer transform scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mr-6">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
                      <p className="text-base text-gray-600">Check inventory levels</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full text-base py-3" 
                    variant="outline"
                    onClick={() => router.push("/Staff/inventory")}
                  >
                    Monitor Inventory
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer transform scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-6">
                      <Package className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Product Records</h3>
                      <p className="text-base text-gray-600">View and adjust stock</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full text-base py-3" 
                    variant="outline"
                    onClick={() => router.push("/Staff/products")}
                  >
                    Manage Products
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer transform scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mr-6">
                      <ShoppingCart className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Pending Orders</h3>
                      <p className="text-base text-gray-600">Review and process</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full text-base py-3" 
                    variant="outline"
                    onClick={() => router.push("/Staff/orders")}
                  >
                    View Orders
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer transform scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mr-6">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                      <p className="text-base text-gray-600">View reports</p>
                    </div>
                  </div>
                  <Button className="w-full text-base py-3" variant="outline">
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <Card className="transform scale-105">
              <CardContent className="p-8">
                <div className="space-y-5">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${getSeverityColor(activity.severity)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base text-gray-900">{activity.message}</p>
                        <p className="text-sm text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alerts Section */}
        {stats.lowStockItems > 0 && (
          <Alert className="mt-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Action Required:</strong> You have {stats.lowStockItems} items with low stock levels. 
              Please review the inventory and create restocking alerts.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}
