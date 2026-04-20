"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Package,
  AlertTriangle,
  Bell,
  CheckCircle,
  RefreshCw,
  Search,
} from "lucide-react";

const items = [
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
    productName: "Welding Wires - 0.8mm",
    currentStock: 3,
    threshold: 20,
    category: "Accessories",
    lastUpdated: "2024-04-20 07:45",
    isFlagged: true,
  },
];

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

export default function InventoryPageUI() {
  return (
    <main className=" mx-auto px-4">
      <div className="flex  items-center gap-2 mb-5">
        <Package className="w-6 h-6 text-blue-600 mr-3" />
        <h1 className="text-xl font-semibold">Low Stock Monitoring</h1>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-gray-600">Total Items</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">1</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-gray-600">Flagged</p>
              <p className="text-2xl font-bold text-blue-600">1</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6 flex justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold mr-3">{item.productName}</h3>

                  <Badge
                    className={getStockLevelColor(
                      item.currentStock,
                      item.threshold,
                    )}
                  >
                    {getCriticalityLevel(item.currentStock, item.threshold)}
                  </Badge>

                  {item.isFlagged && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Flagged
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600">
                  {item.category} • {item.currentStock}/{item.threshold} units
                </p>
              </div>

              <div className="ml-4">
                {item.isFlagged ? (
                  <Button variant="outline">
                    <Bell className="w-4 h-4 mr-2" />
                    Notify Admin
                  </Button>
                ) : (
                  <Button>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Flag
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert */}
      <Alert className="mt-8 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription>Critical stock levels detected.</AlertDescription>
      </Alert>
    </main>
  );
}
