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
import { useTransition } from "react";
import Image from "next/image";
import RemoveItemCartButton from "@/components/shared/product/remove-item-cart-btn";
import AddToCartItemButton from "@/components/shared/product/add-item-cart-btn";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
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
                    <TableCell>
                      <div className="flex-center gap-2">
                        <RemoveItemCartButton
                          item={item}
                          isPending={isPending}
                          startTransition={startTransition}
                        />
                        <span>{item.qty}</span>
                        <AddToCartItemButton
                          item={item}
                          isPending={isPending}
                          startTransition={startTransition}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center ">
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
                  {cart.items.reduce((acc, item) => acc + item.qty, 0)} item
                  {cart.items.reduce((acc, item) => acc + item.qty, 0) > 1
                    ? "s"
                    : ""}
                  ):
                </span>
                <span className="font-bold text-primary">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>

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
