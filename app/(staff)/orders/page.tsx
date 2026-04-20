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
  ShoppingCart, 
  Eye, 
  Edit, 
  Save, 
  X, 
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Package,
  User,
  Calendar,
  DollarSign
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  isEditing?: boolean;
  tempStatus?: Order["status"];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const session = localStorage.getItem("staffSession");
    if (!session) {
      router.push("/Staff/login");
      return;
    }

    loadOrders();
  }, [router]);

  useEffect(() => {
    // Filter orders based on search term and status
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const loadOrders = async () => {
    setIsLoading(true);
    
    // Simulate API call with demo data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const demoData: Order[] = [
      {
        id: "1",
        orderNumber: "ORD-2024-1234",
        customerName: "John Smith",
        customerEmail: "john.smith@example.com",
        items: [
          { id: "1", name: "Carbon Steel Sheets - 2mm", quantity: 5, price: 45.99, total: 229.95 },
          { id: "2", name: "Stainless Steel Pipes - 1/2 inch", quantity: 10, price: 32.50, total: 325.00 },
        ],
        itemsPrice: 554.95,
        shippingPrice: 25.00,
        taxPrice: 44.40,
        totalPrice: 624.35,
        status: "pending",
        isPaid: false,
        isDelivered: false,
        createdAt: "2024-04-20 08:30",
      },
      {
        id: "2",
        orderNumber: "ORD-2024-1235",
        customerName: "Sarah Johnson",
        customerEmail: "sarah.j@example.com",
        items: [
          { id: "3", name: "Welding Wires - 0.8mm", quantity: 20, price: 12.75, total: 255.00 },
          { id: "4", name: "Galvanized Steel Coils", quantity: 2, price: 89.99, total: 179.98 },
        ],
        itemsPrice: 434.98,
        shippingPrice: 35.00,
        taxPrice: 34.80,
        totalPrice: 504.78,
        status: "processing",
        isPaid: true,
        isDelivered: false,
        createdAt: "2024-04-20 09:15",
      },
      {
        id: "3",
        orderNumber: "ORD-2024-1236",
        customerName: "Michael Brown",
        customerEmail: "michael.b@example.com",
        items: [
          { id: "5", name: "Steel Angle Irons - 2x2x1/4", quantity: 15, price: 28.45, total: 426.75 },
        ],
        itemsPrice: 426.75,
        shippingPrice: 20.00,
        taxPrice: 34.14,
        totalPrice: 480.89,
        status: "pending",
        isPaid: true,
        isDelivered: false,
        createdAt: "2024-04-20 10:00",
      },
      {
        id: "4",
        orderNumber: "ORD-2024-1237",
        customerName: "Emily Davis",
        customerEmail: "emily.d@example.com",
        items: [
          { id: "6", name: "Stainless Steel Sheets - 1mm", quantity: 8, price: 67.80, total: 542.40 },
          { id: "7", name: "Carbon Steel Pipes - 3/4 inch", quantity: 12, price: 38.25, total: 459.00 },
        ],
        itemsPrice: 1001.40,
        shippingPrice: 45.00,
        taxPrice: 80.11,
        totalPrice: 1126.51,
        status: "completed",
        isPaid: true,
        isDelivered: true,
        createdAt: "2024-04-19 14:30",
      },
      {
        id: "5",
        orderNumber: "ORD-2024-1238",
        customerName: "Robert Wilson",
        customerEmail: "robert.w@example.com",
        items: [
          { id: "8", name: "Steel Rebar - 12mm", quantity: 50, price: 15.60, total: 780.00 },
        ],
        itemsPrice: 780.00,
        shippingPrice: 30.00,
        taxPrice: 62.40,
        totalPrice: 872.40,
        status: "cancelled",
        isPaid: false,
        isDelivered: false,
        createdAt: "2024-04-20 11:45",
      },
    ];

    setOrders(demoData);
    setFilteredOrders(demoData);
    setIsLoading(false);
  };

  const handleEditStatus = (orderId: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, isEditing: true, tempStatus: order.status }
          : { ...order, isEditing: false, tempStatus: undefined }
      )
    );
  };

  const handleCancel = (orderId: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, isEditing: false, tempStatus: undefined }
          : order
      )
    );
  };

  const handleSaveStatus = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.tempStatus === undefined) return;

    setIsUpdating(orderId);
    setMessage(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update the order status
    setOrders(prev => 
      prev.map(o => 
        o.id === orderId 
          ? { 
              ...o, 
              status: o.tempStatus!,
              isEditing: false, 
              tempStatus: undefined
            }
          : o
      )
    );

    setMessage({
      type: "success",
      text: `Order ${order.orderNumber} status updated to ${order.tempStatus}.`
    });
    setTimeout(() => setMessage(null), 3000);
    setIsUpdating(null);
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, tempStatus: newStatus }
          : order
      )
    );
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending": return <AlertTriangle className="w-3 h-3" />;
      case "processing": return <RefreshCw className="w-3 h-3" />;
      case "completed": return <CheckCircle className="w-3 h-3" />;
      case "cancelled": return <X className="w-3 h-3" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
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
              <ShoppingCart className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Order Management</h1>
            </div>
            <Button onClick={loadOrders} variant="outline">
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

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search orders by number, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <Label htmlFor="status-filter" className="sr-only">Status Filter</Label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "No orders available"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {order.orderNumber}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600">Customer</p>
                            <p className="font-medium text-gray-900">{order.customerName}</p>
                            <p className="text-sm text-gray-500">{order.customerEmail}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600">Items</p>
                            <p className="font-medium text-gray-900">{order.items.length} products</p>
                            <p className="text-sm text-gray-500">{order.itemsPrice.toFixed(2)} USD</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="font-bold text-lg text-gray-900">${order.totalPrice.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">
                              {order.isPaid ? "Paid" : "Unpaid"} | 
                              {order.isDelivered ? " Delivered" : " Not delivered"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        Created: {order.createdAt}
                      </div>
                    </div>

                    <div className="ml-6 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      
                      {!order.isEditing ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStatus(order.id)}
                          className="w-full"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Update Status
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <select
                            value={order.tempStatus}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                            className="w-full h-8 px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              onClick={() => handleSaveStatus(order.id)}
                              disabled={isUpdating === order.id}
                            >
                              {isUpdating === order.id ? (
                                <div className="animate-spin w-3 h-3 border-b-2 border-white rounded-full" />
                              ) : (
                                <Save className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancel(order.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{selectedOrder.orderNumber}</CardTitle>
                    <p className="text-gray-600 mt-1">Order Details</p>
                  </div>
                  <Button variant="ghost" onClick={() => setShowDetails(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                    <div className="bg-gray-50 p-3 rounded">
                      <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                      <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                          </div>
                          <p className="font-semibold">${item.total.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
                    <div className="bg-gray-50 p-3 rounded space-y-1">
                      <div className="flex justify-between">
                        <span>Items:</span>
                        <span>${selectedOrder.itemsPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>${selectedOrder.shippingPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${selectedOrder.taxPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Status */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Order Status</h3>
                    <div className="flex space-x-2">
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1 capitalize">{selectedOrder.status}</span>
                      </Badge>
                      <Badge className={selectedOrder.isPaid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {selectedOrder.isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                      <Badge className={selectedOrder.isDelivered ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {selectedOrder.isDelivered ? "Delivered" : "Not Delivered"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
