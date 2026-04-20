"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Package, 
  AlertTriangle, 
  Bell, 
  CheckCircle,
  RefreshCw,
  Search
} from "lucide-react";

interface LowStockItem {
  id: string;
  productName: string;
  currentStock: number;
  threshold: number;
  category: string;
  lastUpdated: string;
  isFlagged: boolean;
}

export default function InventoryPage() {
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LowStockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const session = localStorage.getItem("staffSession");
    if (!session) {
      router.push("/Staff/login");
      return;
    }

    loadLowStockData();
  }, [router]);

  useEffect(() => {
    // Filter items based on search term
    const filtered = lowStockItems.filter(item =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, lowStockItems]);

  const loadLowStockData = async () => {
    setIsLoading(true);
    
    // Simulate API call with demo data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const demoData: LowStockItem[] = [
      {
        id: "1",
        productName: "Carbon Steel Sheets - 2mm",
        currentStock: 5,
        threshold: 10,
        category: "Carbon Steel",
        lastUpdated: "2024-04-20 08:30",
        isFlagged: false,
      },
      {
        id: "2",
        productName: "Stainless Steel Pipes - 1/2 inch",
        currentStock: 8,
        threshold: 15,
        category: "Stainless Steel",
        lastUpdated: "2024-04-20 09:15",
        isFlagged: false,
      },
      {
        id: "3",
        productName: "Welding Wires - 0.8mm",
        currentStock: 3,
        threshold: 20,
        category: "Accessories",
        lastUpdated: "2024-04-20 07:45",
        isFlagged: true,
      },
      {
        id: "4",
        productName: "Galvanized Steel Coils",
        currentStock: 12,
        threshold: 25,
        category: "Galvanized Steel",
        lastUpdated: "2024-04-20 10:00",
        isFlagged: false,
      },
      {
        id: "5",
        productName: "Steel Angle Irons - 2x2x1/4",
        currentStock: 6,
        threshold: 15,
        category: "Structural Steel",
        lastUpdated: "2024-04-20 08:00",
        isFlagged: false,
      },
    ];

    setLowStockItems(demoData);
    setFilteredItems(demoData);
    setIsLoading(false);
  };

  const handleFlagForRestocking = async (itemId: string) => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update the item status
    setLowStockItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, isFlagged: true }
          : item
      )
    );

    // Show success message (in real app, use toast notification)
    alert("Item flagged for restocking. Administrator has been notified.");
    setIsProcessing(false);
  };

  const handleNotifyAdmin = async (itemId: string) => {
    setIsProcessing(true);
    
    // Simulate API call to notify admin
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert("Administrator notification sent successfully!");
    setIsProcessing(false);
  };

  const getStockLevelColor = (current: number, threshold: number) => {
    const ratio = current / threshold;
    if (ratio <= 0.3) return "text-red-600 bg-red-100 border-red-200";
    if (ratio <= 0.6) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    return "text-orange-600 bg-orange-100 border-orange-200";
  };

  const getCriticalityLevel = (current: number, threshold: number) => {
    const ratio = current / threshold;
    if (ratio <= 0.3) return "Critical";
    if (ratio <= 0.6) return "Low";
    return "Moderate";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory data...</p>
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
              <Button
                variant="ghost"
                onClick={() => router.push("/Staff/dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Package className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Low Stock Monitoring</h1>
            </div>
            <Button onClick={loadLowStockData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Low Stock Items</p>
                  <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Items</p>
                  <p className="text-2xl font-bold text-red-600">
                    {lowStockItems.filter(item => (item.currentStock / item.threshold) <= 0.3).length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Flagged for Restocking</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {lowStockItems.filter(item => item.isFlagged).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Low Stock Items List */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No low stock items found</h3>
                <p className="text-gray-600">
                  {searchTerm ? "Try adjusting your search terms" : "All inventory levels are within acceptable ranges"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {item.productName}
                        </h3>
                        <Badge className={getStockLevelColor(item.currentStock, item.threshold)}>
                          {getCriticalityLevel(item.currentStock, item.threshold)}
                        </Badge>
                        {item.isFlagged && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Flagged
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Current Stock</p>
                          <p className="font-semibold text-gray-900">{item.currentStock} units</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Threshold</p>
                          <p className="font-semibold text-gray-900">{item.threshold} units</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Category</p>
                          <p className="font-semibold text-gray-900">{item.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Last Updated</p>
                          <p className="font-semibold text-gray-900">{item.lastUpdated}</p>
                        </div>
                      </div>

                      {/* Stock Level Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Stock Level</span>
                          <span>{Math.round((item.currentStock / item.threshold) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              (item.currentStock / item.threshold) <= 0.3
                                ? "bg-red-500"
                                : (item.currentStock / item.threshold) <= 0.6
                                ? "bg-yellow-500"
                                : "bg-orange-500"
                            }`}
                            style={{ width: `${Math.min((item.currentStock / item.threshold) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 space-y-2">
                      {!item.isFlagged ? (
                        <Button
                          onClick={() => handleFlagForRestocking(item.id)}
                          disabled={isProcessing}
                          className="w-full"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Flag for Restocking
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleNotifyAdmin(item.id)}
                          disabled={isProcessing}
                          variant="outline"
                          className="w-full"
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          Notify Admin
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Alert for Critical Items */}
        {lowStockItems.some(item => (item.currentStock / item.threshold) <= 0.3) && (
          <Alert className="mt-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Critical Alert:</strong> Some items have critically low stock levels (30% or below). 
              Immediate action is required to prevent stockouts.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}
