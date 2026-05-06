import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { X } from "lucide-react";
import CancelOrderButton from "./cancel-order";
import PlaceOrderForm from "./place-order-form";

export const metadata: Metadata = {
  title: "Place Order",
};

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect("/cart");

  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");

  const userAddress = user.address as ShippingAddress;

  const itemSelected = cart.itemSelected;

  const selectedSet = new Set(itemSelected);

  const selectedItems = cart.items.filter((item) =>
    selectedSet.has(item.productId),
  );

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-xl">Place Order</h1>

      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 space-y-4">
          {/* Shipping */}
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}{" "}
                {userAddress.postalCode}, {userAddress.country}
              </p>

              <div className="mt-3">
                <Link href="/shipping-address">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{user.paymentMethod}</p>

              <div className="mt-3">
                <Link href="/payment-method">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Items</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {selectedItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            height={50}
                            width={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>

                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>

                      <TableCell>₱{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>

              <div className="border-t pt-3 mt-3">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Returns & Exchanges:</strong> We accept returns for orders, however, payments are non-refundable. 
                  Items may only be exchanged for another item.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <PlaceOrderForm />
                <CancelOrderButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
