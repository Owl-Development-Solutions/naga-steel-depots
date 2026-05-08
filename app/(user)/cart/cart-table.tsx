"use client";

import { Cart, CartItem } from "@/types";
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
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trash } from "lucide-react";
import RemoveItemCartButton from "@/components/shared/product/remove-item-cart-btn";
import AddToCartItemButton from "@/components/shared/product/add-item-cart-btn";
import { Input } from "@/components/ui/input";
import {
  deleteItemFromCart,
  setItemQty,
  updateSelectedItems,
} from "@/lib/actions/cart.actions";
import { toast } from "sonner";
import DeleteDialog from "@/components/shared/delete-dialog";

const CartTable = ({ cart }: { cart?: Cart }) => {
  console.log(cart);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const [removedItems, setRemovedItems] = useState<CartItem[]>([]);

  // useEffect(() => {
  //   if (cart && cart.items.length > 0) {
  //     setSelectedItems(new Set(cart.items.map((item) => item.productId)));

  //     setQuantities((prev) => {
  //       const next = { ...prev };
  //       cart.items.forEach((item) => {
  //         if (next[item.productId] === undefined) {
  //           next[item.productId] = item.qty.toString();
  //         }
  //       });
  //       return next;
  //     });
  //   }
  // }, [cart]);

  useEffect(() => {
    if (cart && cart.items.length > 0) {
      setSelectedItems(new Set(cart.items.map((item) => item.productId)));

      const newQuantities: Record<string, string> = {};
      cart.items.forEach((item) => {
        newQuantities[item.productId] = item.qty.toString();
      });
      setQuantities(newQuantities);
    }
  }, [cart]);

  const handleSelectionChange = (itemId: string, selected: boolean) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (selected) newSet.add(itemId);
      else newSet.delete(itemId);
      return newSet;
    });
  };

  const handleQtyChange = (productId: string, value: string) => {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  const handleQtyBlur = (item: CartItem) => {
    const raw = quantities[item.productId];
    const parsed = parseInt(raw);
    const currentQty = item.qty;

    if (isNaN(parsed) || parsed < 1) {
      setQuantities((prev) => ({
        ...prev,
        [item.productId]: currentQty.toString(),
      }));
      return;
    }

    if (parsed === currentQty) return;

    startTransition(async () => {
      const res = await setItemQty(item.productId, parsed);
      if (!res.success) {
        toast.error(res.message);
        setQuantities((prev) => ({
          ...prev,
          [item.productId]: currentQty.toString(),
        }));
      }
    });
  };

  const selectedItemsData =
    cart?.items.filter((item) => selectedItems.has(item.productId)) || [];
  const selectedSubtotal = selectedItemsData.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0,
  );
  const selectedTotalItems = selectedItemsData.reduce(
    (acc, item) => acc + item.qty,
    0,
  );

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
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow
                    key={item.slug}
                    className={
                      !selectedItems.has(item.productId) ? "opacity-60" : ""
                    }
                  >
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
                        className="flex items-center"
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
                      <div className="flex-center gap-2">
                        <RemoveItemCartButton
                          item={item}
                          isPending={isPending}
                          startTransition={startTransition}
                        />

                        <Input
                          type="number"
                          min={1}
                          value={quantities[item.productId] ?? item.qty}
                          onChange={(e) =>
                            handleQtyChange(item.productId, e.target.value)
                          }
                          onBlur={() => handleQtyBlur(item)}
                          className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          disabled={isPending}
                        />

                        <AddToCartItemButton
                          item={item}
                          isPending={isPending}
                          startTransition={startTransition}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">₱{item.price}</TableCell>
                    <TableCell className="text-center">
                      <DeleteDialog
                        id={item.productId}
                        action={deleteItemFromCart as any}
                      />
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
                  Subtotal ({selectedTotalItems} item
                  {selectedTotalItems > 1 ? "s" : ""}
                  {selectedItemsData.length < cart.items.length &&
                    ` of ${cart.items.length}`}
                  ):
                </span>
                <span className="font-bold text-primary">
                  {formatCurrency(selectedSubtotal.toString())}
                </span>
              </div>

              {selectedItemsData.length < cart.items.length && (
                <div className="text-sm text-muted-foreground">
                  {cart.items.length - selectedItemsData.length} item
                  {cart.items.length - selectedItemsData.length > 1
                    ? "s"
                    : ""}{" "}
                  not selected
                </div>
              )}

              <Button
                className="w-full cursor-pointer flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 transition"
                disabled={isPending || selectedItemsData.length === 0}
                onClick={() => {
                  startTransition(async () => {
                    const checkedItems =
                      cart?.items.filter((item) =>
                        selectedItems.has(item.productId),
                      ) || [];

                    let selected = [];

                    for (const item of checkedItems) {
                      selected.push(item.productId);
                    }

                    await updateSelectedItems(selected);

                    router.push("/shipping-address");
                  });
                }}
              >
                <ArrowRight className="w-4 h-4" />
                Checkout ({selectedItemsData.length})
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
