"use client";

import { Cart } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useTransition, useState, useEffect } from "react";
import Image from "next/image";
import CartCheckbox from "@/components/shared/product/cart-checkbox";
import CartQuantityOnly from "@/components/shared/product/cart-quantity-only";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Initialize selected items (all items selected by default)
  useEffect(() => {
    if (cart && cart.items.length > 0) {
      setSelectedItems(new Set(cart.items.map(item => item.productId)));
    }
  }, [cart]);

  const handleSelectionChange = (itemId: string, selected: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  // Calculate selected items subtotal
  const selectedItemsData = cart?.items.filter(item => selectedItems.has(item.productId)) || [];
  const selectedSubtotal = selectedItemsData.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0);
  const selectedTotalItems = selectedItemsData.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href="/products">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Select</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug} className={!selectedItems.has(item.productId) ? 'opacity-60' : ''}>
                    <TableCell>
                      <CartCheckbox
                        item={item}
                        isSelected={selectedItems.has(item.productId)}
                        onSelectionChange={handleSelectionChange}
                        disabled={isPending}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex item-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <CartQuantityOnly
                        item={item}
                        isPending={isPending}
                        startTransition={startTransition}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      ₱{item.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card className="p-0">
            <CardContent className="p-6 flex flex-col gap-6">
              <div className="text-base font-medium flex justify-between items-center">
                <span>
                  Subtotal (
                  {selectedTotalItems} item
                  {selectedTotalItems > 1
                    ? "s"
                    : ""}
                  {selectedItemsData.length < cart.items.length && ` of ${cart.items.length}`}
                  ):
                </span>
                <span className="font-bold text-primary">
                  {formatCurrency(selectedSubtotal.toString())}
                </span>
              </div>
              
              {selectedItemsData.length < cart.items.length && (
                <div className="text-sm text-muted-foreground">
                  {cart.items.length - selectedItemsData.length} item{cart.items.length - selectedItemsData.length > 1 ? 's' : ''} not selected
                </div>
              )}

              <Button
                className="w-full cursor-pointer flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 transition"
                disabled={isPending}
                onClick={() => {
                  startTransition(() => {
                    router.push("/shipping-address");
                  });
                }}
              >
                <ArrowRight className="w-4 h-4" />
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
