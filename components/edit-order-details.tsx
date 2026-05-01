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
import { updateOrderStatusAndDriver } from "@/lib/actions/delivery.actions";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  phoneNumber?: string | null;
}

interface EditOrderDetailsProps {
  orderId: string;
  currentDriver?: string | null;
  currentStatus: string;
  drivers: Driver[];
}

const orderStatuses = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const EditOrderDetails = ({
  orderId,
  currentDriver,
  currentStatus,
  drivers,
}: EditOrderDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string>(
    currentDriver || "",
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const result = await updateOrderStatusAndDriver({
        orderId,
        driverId: selectedDriver || undefined,
        status: selectedStatus,
      });

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Order Details</DialogTitle>
          <DialogDescription>Update the order status.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Driver Selection */}
          {/* <div className="grid gap-2">
            <Label htmlFor="driver">Delivery Driver</Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger id="driver">
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Driver Assigned</SelectItem>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                    {driver.phoneNumber && ` (${driver.phoneNumber})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* Status Selection */}
          <div className="grid gap-2">
            <Label htmlFor="status">Order Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {orderStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDetails;
