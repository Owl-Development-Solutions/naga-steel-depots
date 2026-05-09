"use client";

import { useEffect, useState } from "react";
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
  HelpCircle,
} from "lucide-react";
import {
  flagProductForRestock,
  unflagProduct,
  restockProduct,
  getLowStockMonitoring,
} from "@/lib/actions/staff.actions";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

interface LowStockProduct {
  id: string;
  productName: string;
  currentStock: number;
  threshold: number;
  category: string | null;
  lastUpdated: Date | string;
  isFlagged: boolean;
  image: string;
}

interface LowStockData {
  summary: {
    totalItems: number;
    critical: number;
    flagged: number;
  };
  products: LowStockProduct[];
}

interface CriticalAlert {
  hasCritical: boolean;
  criticalCount: number;
  criticalProducts: Array<{
    id: string;
    name: string;
    currentStock: number;
    threshold: number;
  }>;
}

interface LowStockMonitoringUIProps {
  initialData: LowStockData | undefined;
  criticalAlert: CriticalAlert | undefined;
  query: string;
}

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

export default function LowStockMonitoringUI({
  initialData,
  criticalAlert,
  query,
}: LowStockMonitoringUIProps) {
  const [data, setData] = useState<LowStockData | undefined>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);

  console.log("initialData", initialData);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const res = await getLowStockMonitoring({
      query,
    });
    if (res.success) {
      setData(res.data);
      toast.success("Low stock data refreshed");
    } else {
      toast.error(res.message);
    }
    setIsRefreshing(false);
  };

  const handleFlag = async (productId: string, productName: string) => {
    const res = await flagProductForRestock(productId);
    if (res.success) {
      toast.success(res.message);
      // Update local state
      setData((prev) => ({
        ...prev!,
        products: prev!.products.map((p) =>
          p.id === productId ? { ...p, isFlagged: true } : p,
        ),
        summary: {
          ...prev!.summary,
          flagged: prev!.summary.flagged + 1,
        },
      }));
    } else {
      toast.error(res.message);
    }
  };

  // const handleUnflag = async (productId: string, productName: string) => {
  //   const res = await unflagProduct(productId);
  //   if (res.success) {
  //     toast.success(res.message);
  //     // Update local state
  //     setData((prev) => ({
  //       ...prev!,
  //       products: prev!.products.map((p) =>
  //         p.id === productId ? { ...p, isFlagged: false } : p,
  //       ),
  //       summary: {
  //         ...prev!.summary,
  //         flagged: prev!.summary.flagged - 1,
  //       },
  //     }));
  //   } else {
  //     toast.error(res.message);
  //   }
  // };

  const handleRestock = async (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setRestockQuantity("");
    setRestockDialogOpen(true);
  };

  const handleRestockConfirm = async () => {
    if (!selectedProduct) return;

    const quantity = Number(restockQuantity);
    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setRestockingId(selectedProduct.id);
    setRestockDialogOpen(false);

    const res = await restockProduct(selectedProduct.id, quantity);
    if (res.success) {
      toast.success(res.message);
      // Refresh data
      const updatedData = await getLowStockMonitoring({
        query,
      });
      if (updatedData.success) {
        setData(updatedData.data);
      }
      setSelectedProduct(null);
      setRestockQuantity("");
    } else {
      toast.error(res.message);
    }
    setRestockingId(null);
  };

  const handleNotifyAdmin = async (productId: string) => {
    // For now, this just flags the product - in production you'd send an email/notification
    await handleFlag(productId, "");
    toast.success("Admin notification sent");
  };

  const filteredProducts = data?.products.filter((p) =>
    p.productName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <main className="mx-auto px-4">
      <div className="flex items-center gap-2 mb-5 justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600 mr-3" />
          <h1 className="text-xl font-semibold">Low Stock Monitoring</h1>
        </div>

        <div className="flex items-center gap-2">
          {query && (
            <div>
              Filtered by <i>&quot;{query}&quot;</i>
              <Link href="/staff/inventory">
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-3 cursor-pointer"
                >
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ml-auto"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-gray-600">Total Items</p>
              <p className="text-2xl font-bold">
                {data?.summary.totalItems || 0}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <div className="flex items-center gap-1">
                <p className="text-gray-600">Critical</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Products at or below 30% of their threshold</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {data?.summary.critical || 0}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between">
            <div>
              <div className="flex items-center gap-1">
                <p className="text-gray-600">Flagged</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Products flagged for restock notification</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {data?.summary.flagged || 0}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      {/* <div className="mb-4 flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div> */}

      {/* Critical Alert */}
      {criticalAlert?.hasCritical && (
        <Alert className="mt-8 " variant="destructive">
          <AlertTriangle className="h-4 w-4 " />
          <AlertDescription>
            <strong className="">Critical stock levels detected!</strong>{" "}
            {criticalAlert.criticalCount} product(s) are at or below 30% of
            their threshold:
            <ul className="list-disc list-inside mt-2">
              {criticalAlert.criticalProducts.map((p) => (
                <li key={p.id}>
                  {p.name}: {p.currentStock} units (threshold: {p.threshold})
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Product List */}
      <div className="space-y-4 mt-8">
        {!data || data.products.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No low stock items found</p>
            </CardContent>
          </Card>
        ) : (
          filteredProducts?.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6 flex justify-between items-center gap-3">
                <div className="">
                  <Image
                    src={item.image}
                    width={70}
                    height={70}
                    alt="product-image"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2 flex-wrap gap-2">
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
                      <Badge className="bg-blue-100 text-blue-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Flagged
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {item.category} • {item.currentStock}/{item.threshold} units
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Last updated: {new Date(item.lastUpdated).toLocaleString()}
                  </p>
                </div>

                <div className="ml-4 flex gap-2">
                  {item.isFlagged ? (
                    <Button
                      variant="outline"
                      onClick={() => handleRestock(item.id, item.productName)}
                      disabled={restockingId === item.id}
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-2 ${restockingId === item.id ? "animate-spin" : ""}`}
                      />
                      Restock
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleFlag(item.id, item.productName)}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Flag
                      </Button>
                      <Button
                        onClick={() => handleRestock(item.id, item.productName)}
                        disabled={restockingId === item.id}
                      >
                        <RefreshCw
                          className={`w-4 h-4 mr-2 ${restockingId === item.id ? "animate-spin" : ""}`}
                        />
                        Restock
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Restock Dialog */}
      <Dialog open={restockDialogOpen} onOpenChange={setRestockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restock Product</DialogTitle>
            <DialogDescription>
              Enter the quantity to add to{" "}
              <span className="font-semibold">{selectedProduct?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="mt-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRestockConfirm();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRestockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRestockConfirm}>Confirm Restock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
