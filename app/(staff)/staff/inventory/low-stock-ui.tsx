"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

      {/* Critical Products Table - Enhanced Layout */}
      <div className="mt-8 space-y-6">
        {/* Critical Products Summary */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <Card className="border-l-4 border-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Critical Items</p>
                  <p className="text-2xl font-bold text-red-600">
                    {data?.products.filter(p => p.currentStock <= (p.threshold * 0.3)).length || 0}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card> */}

          {/* <Card className="border-l-4 border-yellow-500 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Low Stock Items</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {data?.products.filter(p => p.currentStock > (p.threshold * 0.3) && p.currentStock <= p.threshold).length || 0}
                  </p>
                </div>
                <Package className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card> */}
{/* 
          <Card className="border-l-4 border-blue-500 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Items</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {data?.products.length || 0}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Detailed Products Table */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Critical Products Details</h2>
                  <p className="text-sm text-gray-600">Products requiring immediate attention - sorted by urgency</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800">
                  {data?.products.filter(p => p.currentStock <= (p.threshold * 0.3)).length || 0} Critical
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {data?.products.filter(p => p.currentStock > (p.threshold * 0.3) && p.currentStock <= p.threshold).length || 0} Low Stock
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 border-b sticky top-0">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700 w-[300px]">Product Information</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center w-[120px]">Stock Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center w-[100px]">Current</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center w-[100px]">Threshold</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center w-[120px]">Urgency Level</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[150px]">Last Updated</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center w-[180px]">Quick Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!data || data.products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-4">
                          <Package className="w-12 h-12 text-gray-400" />
                          <div>
                            <p className="text-gray-600 font-medium">No critical products found</p>
                            <p className="text-sm text-gray-500">
                              All products are above their minimum stock levels
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Sort products by urgency (critical first, then by stock percentage)
                    [...(filteredProducts || [])].sort((a, b) => {
                      const aCritical = a.currentStock <= (a.threshold * 0.3);
                      const bCritical = b.currentStock <= (b.threshold * 0.3);
                      const aPercent = (a.currentStock / a.threshold) * 100;
                      const bPercent = (b.currentStock / b.threshold) * 100;
                      
                      if (aCritical && !bCritical) return -1;
                      if (!aCritical && bCritical) return 1;
                      return aPercent - bPercent;
                    }).map((item) => {
                      const isCritical = item.currentStock <= (item.threshold * 0.3);
                      const stockPercentage = (item.currentStock / item.threshold) * 100;
                      const urgencyLevel = isCritical ? 'CRITICAL' : stockPercentage <= 50 ? 'HIGH' : 'MEDIUM';
                      const urgencyColor = isCritical ? 'red' : stockPercentage <= 50 ? 'orange' : 'yellow';
                      
                      return (
                        <TableRow 
                          key={item.id} 
                          className={`hover:bg-gray-50 transition-colors ${
                            isCritical ? 'bg-red-50 border-l-4 border-red-500' : 'bg-yellow-50 border-l-4 border-yellow-500'
                          }`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                isCritical ? '' : 'bg-yellow-100'
                              }`}>
                                <Package className={`w-6 h-6 ${
                                  isCritical ? 'text-red-600' : 'text-yellow-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">{item.productName}</div>
                                <div className="text-sm text-gray-500">ID: {item.id}</div>
                                <Badge variant="outline" className="bg-gray-50 mt-1">
                                  {item.category || 'Uncategorized'}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Badge 
                                className={`${getStockLevelColor(item.currentStock, item.threshold)}`}
                              >
                                {getCriticalityLevel(item.currentStock, item.threshold)}
                              </Badge>
                              {isCritical && (
                                <div className="flex items-center text-xs text-red-600 font-medium">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  CRITICAL
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className={`font-bold text-xl ${
                              isCritical ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {item.currentStock}
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.round(stockPercentage)}%
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="font-medium text-gray-700">{item.threshold}</div>
                            <div className="text-xs text-gray-500">min</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={`bg-${urgencyColor}-100 text-${urgencyColor}-800`}>
                              {urgencyLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              {new Date(item.lastUpdated).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(item.lastUpdated).toLocaleTimeString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center">
                              {item.isFlagged ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRestock(item.id, item.productName)}
                                  disabled={restockingId === item.id}
                                  className="flex-1"
                                >
                                  <RefreshCw
                                    className={`w-4 h-4 mr-1 ${restockingId === item.id ? "animate-spin" : ""}`}
                                  />
                                  Restock
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFlag(item.id, item.productName)}
                                    className="flex-1"
                                  >
                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                    Flag
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleRestock(item.id, item.productName)}
                                    disabled={restockingId === item.id}
                                    className="flex-1"
                                  >
                                    <RefreshCw
                                      className={`w-4 h-4 mr-1 ${restockingId === item.id ? "animate-spin" : ""}`}
                                    />
                                    Restock
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
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
