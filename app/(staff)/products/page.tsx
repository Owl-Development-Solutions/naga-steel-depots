"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Package, 
  Edit, 
  Save, 
  X, 
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  price: number;
  lastUpdated: string;
  isEditing?: boolean;
  tempStock?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const session = localStorage.getItem("staffSession");
    if (!session) {
      router.push("/Staff/login");
      return;
    }

    loadProducts();
  }, [router]);

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const loadProducts = async () => {
    setIsLoading(true);
    
    // Simulate API call with demo data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const demoData: Product[] = [
      {
        id: "1",
        name: "Carbon Steel Sheets - 2mm",
        category: "Carbon Steel",
        currentStock: 25,
        price: 45.99,
        lastUpdated: "2024-04-20 08:30",
      },
      {
        id: "2",
        name: "Stainless Steel Pipes - 1/2 inch",
        category: "Stainless Steel",
        currentStock: 18,
        price: 32.50,
        lastUpdated: "2024-04-20 09:15",
      },
      {
        id: "3",
        name: "Welding Wires - 0.8mm",
        category: "Accessories",
        currentStock: 45,
        price: 12.75,
        lastUpdated: "2024-04-20 07:45",
      },
      {
        id: "4",
        name: "Galvanized Steel Coils",
        category: "Galvanized Steel",
        currentStock: 12,
        price: 89.99,
        lastUpdated: "2024-04-20 10:00",
      },
      {
        id: "5",
        name: "Steel Angle Irons - 2x2x1/4",
        category: "Structural Steel",
        currentStock: 33,
        price: 28.45,
        lastUpdated: "2024-04-20 08:00",
      },
      {
        id: "6",
        name: "Stainless Steel Sheets - 1mm",
        category: "Stainless Steel",
        currentStock: 8,
        price: 67.80,
        lastUpdated: "2024-04-20 11:30",
      },
      {
        id: "7",
        name: "Carbon Steel Pipes - 3/4 inch",
        category: "Carbon Steel",
        currentStock: 56,
        price: 38.25,
        lastUpdated: "2024-04-20 06:45",
      },
      {
        id: "8",
        name: "Steel Rebar - 12mm",
        category: "Structural Steel",
        currentStock: 120,
        price: 15.60,
        lastUpdated: "2024-04-20 09:30",
      },
    ];

    setProducts(demoData);
    setFilteredProducts(demoData);
    setIsLoading(false);
  };

  const handleEdit = (productId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, isEditing: true, tempStock: product.currentStock }
          : { ...product, isEditing: false, tempStock: undefined }
      )
    );
  };

  const handleCancel = (productId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, isEditing: false, tempStock: undefined }
          : product
      )
    );
  };

  const validateStockUpdate = (newStock: number): boolean => {
    // Validation rules
    if (isNaN(newStock)) return false;
    if (newStock < 0) return false;
    if (newStock > 9999) return false;
    return true;
  };

  const handleSave = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.tempStock === undefined) return;

    // Validate the update
    if (!validateStockUpdate(product.tempStock)) {
      setMessage({
        type: "error",
        text: "Invalid stock value. Please enter a number between 0 and 9999."
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setIsUpdating(productId);
    setMessage(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update the product
    setProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { 
              ...p, 
              currentStock: p.tempStock!, 
              isEditing: false, 
              tempStock: undefined,
              lastUpdated: new Date().toLocaleString("en-US", {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          : p
      )
    );

    setMessage({
      type: "success",
      text: `Stock for ${product.name} updated successfully to ${product.tempStock} units.`
    });
    setTimeout(() => setMessage(null), 3000);
    setIsUpdating(null);
  };

  const handleStockChange = (productId: string, value: string) => {
    const numValue = parseInt(value);
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, tempStock: isNaN(numValue) ? undefined : numValue }
          : product
      )
    );
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 10) return { label: "Low", color: "bg-red-100 text-red-800 border-red-200" };
    if (stock <= 25) return { label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
    return { label: "Good", color: "bg-green-100 text-green-800 border-green-200" };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
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
              <h1 className="text-xl font-semibold text-gray-900">Product Records</h1>
            </div>
            <Button onClick={loadProducts} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Alert */}
        {message && (
          <Alert className={`mb-6 ${
            message.type === "error" 
              ? "border-red-200 bg-red-50" 
              : "border-green-200 bg-green-50"
          }`}>
            {message.type === "error" ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className={
              message.type === "error" ? "text-red-800" : "text-green-800"
            }>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Search */}
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? "Try adjusting your search terms" : "No products available"}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.currentStock);
              return (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                        <Badge className={stockStatus.color}>
                          {stockStatus.label} Stock
                        </Badge>
                      </div>
                      {!product.isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Category:</span>
                        <span className="text-sm font-medium">{product.category}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Stock:</span>
                        {product.isEditing ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={product.tempStock || ""}
                              onChange={(e) => handleStockChange(product.id, e.target.value)}
                              className="w-20 h-8 text-sm"
                              min="0"
                              max="9999"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSave(product.id)}
                              disabled={isUpdating === product.id}
                            >
                              {isUpdating === product.id ? (
                                <div className="animate-spin w-3 h-3 border-b-2 border-white rounded-full" />
                              ) : (
                                <Save className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancel(product.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-gray-900">
                            {product.currentStock} units
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Updated:</span>
                        <span className="text-sm font-medium">{product.lastUpdated}</span>
                      </div>
                    </div>

                    {!product.isEditing && product.currentStock <= 10 && (
                      <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-xs text-yellow-800">
                          <AlertTriangle className="w-3 h-3 inline mr-1" />
                          Low stock - Consider restocking
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Stock Adjustment Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. Click the edit icon (pencil) on any product card to adjust stock levels</p>
              <p>2. Enter the new stock quantity (must be between 0 and 9999)</p>
              <p>3. Click the save icon to confirm the update or X to cancel</p>
              <p>4. The system will validate the update and save it to the database</p>
              <p>5. A success message will confirm when the update is complete</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
