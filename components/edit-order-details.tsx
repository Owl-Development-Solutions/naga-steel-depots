"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { updateOrderStatusAndDriver } from "@/lib/actions/delivery.actions";
import { toast } from "sonner";
import {
  Pencil,
  Truck,
  Package,
  Calendar,
  Edit3,
  AlertTriangle,
  CheckCircle,
  Info,
  User,
  MapPin,
  Phone,
} from "lucide-react";

interface Driver {
  id: string;
  name: string;
  phoneNumber?: string | null;
  address?: any;
}

interface EditOrderDetailsProps {
  orderId: string;
  currentDriver?: string | null;
  currentStatus: string;
  drivers: Driver[];
  onOrderUpdated?: () => void;
}

const orderStatuses = [
  {
    value: "pending",
    label: "Pending",
    description: "Order received but not processed",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    value: "processing",
    label: "Processing",
    description: "Order is being prepared",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "shipped",
    label: "Shipped",
    description: "Order is on the way",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    value: "delivered",
    label: "Delivered",
    description: "Order has been delivered",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    description: "Order has been cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
  },
];

const carriers = [
  { value: "LBC", label: "LBC Express" },
  { value: "JRS", label: "JRS Express" },
  { value: "2GO", label: "2GO Express" },
  { value: "AP Cargo", label: "AP Cargo" },
  { value: "Flash", label: "Flash Express" },
  { value: "Other", label: "Other" },
];

const EditOrderDetails = ({
  orderId,
  currentDriver,
  currentStatus,
  drivers,
  onOrderUpdated,
}: EditOrderDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find current driver ID from driver name
  const currentDriverId =
    drivers.find((driver) => driver.address?.fullName === currentDriver)?.id ||
    "";

  // Initialize form when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Reset form to current values when opening
      setSelectedStatus(currentStatus);
      setSelectedDriver(currentDriverId || "none");
      setTrackingNumber("");
      setSelectedCarrier("");
      setNotes("");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare update data
      const updateData: any = {
        orderId,
        status: selectedStatus,
      };

      // Only include driver if one is selected and not "none"
      if (selectedDriver && selectedDriver !== "none") {
        updateData.driverId = selectedDriver;
      } else if (selectedDriver === "none") {
        updateData.driverId = "none"; // Explicitly pass "none" to clear driver
      }

      // Include tracking info for shipped orders
      if (selectedStatus === "shipped") {
        updateData.trackingNumber = trackingNumber || undefined;
        updateData.carrier = selectedCarrier || undefined;
      }

      // Include notes
      updateData.notes = notes || undefined;

      const result = await updateOrderStatusAndDriver(updateData);

      if (result.success) {
        toast.success("Order updated successfully!");
        setOpen(false);

        // Reset form
        setSelectedDriver("");
        setTrackingNumber("");
        setSelectedCarrier("");
        setNotes("");

        // Call the refresh callback
        if (onOrderUpdated) {
          onOrderUpdated();
        }
      } else {
        toast.error(result.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);

    // Auto-clear driver if status is cancelled or delivered
    if (status === "cancelled" || status === "delivered") {
      setSelectedDriver("none");
    }
  };

  const getStatusDescription = (status: string) => {
    const statusInfo = orderStatuses.find((s) => s.value === status);
    return statusInfo?.description || "";
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="w-full cursor-pointer flex items-center">
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Order
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-blue-600" />
            </div>
            Edit Order Details
          </DialogTitle>
          <DialogDescription className="text-base">
            Update order status, assign driver, and manage shipping information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Information Card */}
          <Card className="border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2 text-gray-700">
                <Package className="w-4 h-4" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Order ID
                    </p>
                    <p className="font-mono text-lg font-semibold">
                      #{orderId.slice(-8)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    Current Status
                  </p>
                  <Badge
                    className={`${orderStatuses.find((s) => s.value === currentStatus)?.color || "bg-gray-100 text-gray-800 border-gray-200"} px-3 py-1`}
                  >
                    {orderStatuses.find((s) => s.value === currentStatus)
                      ?.label || currentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional 2x2 Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Status - Top Left */}
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select
                  value={selectedStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status" className="h-11">
                    <SelectValue placeholder="Select order status" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={`${status.color} text-xs`}>
                            {status.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedStatus && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {
                            orderStatuses.find(
                              (s) => s.value === selectedStatus,
                            )?.label
                          }
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getStatusDescription(selectedStatus)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Driver - Top Right */}
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  Delivery Driver
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select
                  value={selectedDriver || currentDriverId || "none"}
                  onValueChange={setSelectedDriver}
                >
                  <SelectTrigger id="driver" className="h-11">
                    <SelectValue placeholder="Assign delivery driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">
                          No Driver Assigned
                        </span>
                      </div>
                    </SelectItem>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">
                              {driver.address?.fullName || driver.name}
                            </span>
                          </div>
                          {driver.phoneNumber && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-6">
                              <Phone className="w-3 h-3" />
                              {driver.phoneNumber}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentDriver && !selectedDriver && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                      <strong>Currently assigned:</strong> {currentDriver}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Carrier - Bottom Left */}
            {/* <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-purple-600" />
                  </div>
                  Shipping Carrier
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                  <SelectTrigger id="carrier" className="h-11">
                    <SelectValue placeholder="Select shipping carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((carrier) => (
                      <SelectItem key={carrier.value} value={carrier.value}>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-500" />
                          {carrier.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card> */}

            {/* Tracking Number - Bottom Right */}
            {/* <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  Tracking Number
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  id="tracking"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="h-11"
                />
              </CardContent>
            </Card> */}
          </div>

          {/* Order Notes Card */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </div>
                Order Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                placeholder="Add any notes about this order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Status Alerts */}
          {selectedStatus === "cancelled" && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">
                      Order Cancellation Warning
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Cancelling this order will mark it as cancelled. This
                      action cannot be easily undone.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedStatus === "delivered" && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">
                      Order Completion
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      Marking this order as delivered will complete the order
                      process.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-6" />
        <DialogFooter className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            className="h-11 px-6"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedStatus}
            className="h-11 px-6 min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              "Update Order"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDetails;
