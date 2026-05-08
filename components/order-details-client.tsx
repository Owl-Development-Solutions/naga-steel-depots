"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/utils";
import { getOrderById } from "@/lib/actions/order.actions";
import { getUserDriver } from "@/lib/actions/user.actions";
import AssignDeliveryDriver from "./driver-assign-form";
import EditOrderDetails from "./edit-order-details";
import { 
  User, 
  Package, 
  Truck, 
  CreditCard, 
  MapPin, 
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

interface OrderDetailsClientProps {
  orderId: string;
  type?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrderDetailsClient({ orderId, type }: OrderDetailsClientProps) {
  const [data, setData] = useState<any>(null);
  const [driver, setDriver] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderData, driverData] = await Promise.all([
          getOrderById(orderId),
          getUserDriver()
        ]);
        setData(orderData);
        setDriver(driverData);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const address = data.shippingAddress as any;
  const paymentResult = data.paymentResult as any;

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
      {/* Order Header Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Order #{data.id.slice(-8)}</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateTime(new Date(data.createdAt)).dateTime}
                </p>
              </div>
            </div>
            <Badge className={`${getStatusColor(data.status)} px-3 py-1`}>
              {data.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-lg font-semibold text-green-600">₱{data.totalPrice}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Payment</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                {data.isPaid ? (
                  <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-green-600">Paid</span></>
                ) : (
                  <><Clock className="w-4 h-4 text-orange-500" /><span className="text-orange-600">Unpaid</span></>
                )}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Delivery</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                {data.isDelivered ? (
                  <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-green-600">Delivered</span></>
                ) : (
                  <><Truck className="w-4 h-4 text-gray-500" /><span className="text-gray-600">Pending</span></>
                )}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Items</p>
              <p className="text-lg font-semibold">{data.orderitems?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{data.user?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{data.user?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {address?.phoneNumber || "N/A"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Shipping Address</p>
                <p className="font-medium flex items-start gap-1">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>
                    {address?.streetAddress || "N/A"}, {address?.city || "N/A"}
                    {address?.postalCode && `, ${address.postalCode}`}
                    {address?.country && `, ${address.country}`}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items ({data.orderitems?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.orderitems?.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base truncate">{item.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-muted-foreground">Quantity: {item.qty}</span>
                      <span className="text-sm text-muted-foreground">Unit Price: ₱{item.price}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-lg">₱{Number(item.price) * Number(item.qty)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information Card */}
      {data.deliveryDriver && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Driver</p>
                  <p className="font-medium flex items-center gap-1">
                    <Truck className="w-4 h-4 text-blue-500" />
                    {data.deliveryDriver}
                  </p>
                </div>
                {data.driverPhone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Driver Phone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {data.driverPhone}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {data.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {formatDateTime(new Date(data.estimatedDelivery)).dateOnly}
                    </p>
                  </div>
                )}
                {data.trackingNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-medium">{data.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Information Card */}
      {paymentResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{data.paymentMethod}</p>
                </div>
                {data.paidAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Date</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {formatDateTime(new Date(data.paidAt)).dateTime}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {paymentResult.id && (
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-medium text-sm">{paymentResult.id}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <div className="flex items-center gap-1 mt-1">
                    {data.isPaid ? (
                      <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-green-600">Completed</span></>
                    ) : (
                      <><Clock className="w-4 h-4 text-orange-500" /><span className="text-orange-600">Pending</span></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Price Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items Subtotal</span>
              <span>₱{data.itemsPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping Fee</span>
              <span>₱{data.shippingPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>₱{data.taxPrice}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-xl font-bold text-green-600">₱{data.totalPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Section */}
      {type !== "read-only" && (
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <EditOrderDetails
                orderId={data.id}
                currentStatus={data.status}
                currentDriver={data.deliveryDriver}
                drivers={driver}
              />
              {data.status === "shipped" && !data.deliveryDriver && (
                <AssignDeliveryDriver driver={driver} orderId={data.id} />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
