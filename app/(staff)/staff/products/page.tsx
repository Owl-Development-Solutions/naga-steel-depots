"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Edit, Search, AlertTriangle } from "lucide-react";

const products = [
  {
    id: "1",
    name: "Carbon Steel Sheets - 2mm",
    category: "Carbon Steel",
    currentStock: 25,
    price: 45.99,
    lastUpdated: "04/20 08:30",
  },
  {
    id: "2",
    name: "Stainless Steel Pipes - 1/2 inch",
    category: "Stainless Steel",
    currentStock: 8,
    price: 32.5,
    lastUpdated: "04/20 09:15",
  },
  {
    id: "3",
    name: "Welding Wires - 0.8mm",
    category: "Accessories",
    currentStock: 45,
    price: 12.75,
    lastUpdated: "04/20 07:45",
  },
];

const getStockStatus = (stock: number) => {
  if (stock <= 10)
    return { label: "Low", color: "bg-red-100 text-red-800 border-red-200" };
  if (stock <= 25)
    return {
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
  return {
    label: "Good",
    color: "bg-green-100 text-green-800 border-green-200",
  };
};

export default function ProductsUI() {
  return (
    <main>
      <div className="flex gap-2 items-center mb-5">
        <Package className="w-6 h-6 text-blue-600 mr-3" />
        <h1 className="text-xl font-semibold text-gray-900">Product Records</h1>
      </div>
      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.currentStock);

          return (
            <Card key={product.id}>
              <CardHeader className="pb-3 flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <Badge className={stockStatus.color}>
                    {stockStatus.label} Stock
                  </Badge>
                </div>

                <Button size="sm" variant="ghost">
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span>{product.category}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span>${product.price}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-bold">
                    {product.currentStock} units
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Updated:</span>
                  <span>{product.lastUpdated}</span>
                </div>

                {product.currentStock <= 10 && (
                  <div className="mt-2 p-2 bg-yellow-50 border rounded">
                    <p className="text-xs text-yellow-800">
                      <AlertTriangle className="inline w-3 h-3 mr-1" />
                      Low stock
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
