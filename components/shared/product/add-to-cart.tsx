"use client";

import { Button } from "@/components/ui/button";
import { Cart, CartItem } from "@/types";
import { CheckIcon, PlusIcon, MinusIcon } from "lucide-react";
import { toast } from "sonner";
import {
  addItemToCart,
  removeItemFromCart,
  setItemQty,
} from "@/lib/actions/cart.actions";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const icon = (
    <CheckIcon className="text-green-500 w-5 h-5 rounded-full bg-green-100" />
  );

  //check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  const [quantity, setQuantity] = useState((existItem?.qty || 1).toString());
  const [isPending, startTransition] = useTransition();

  const handleAddToCard = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      console.log(res);

      if (!res.success) {
        toast.error(res.message);

        return;
      }

      //handle success add to cart
      toast.success(res.message, {
        icon: icon,
        action: (
          <Button
            className="bg-primary cursor-pointer text-white hover:bg-gray-800 "
            onClick={() => router.push("/cart")}
          >
            Go to Cart
          </Button>
        ),
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (res.success) {
        toast(res.message);
      } else {
        toast.error(res.message);
      }

      return;
    });
  };

  useEffect(() => {
    if (existItem?.qty !== undefined) {
      setQuantity(existItem.qty.toString());
    }
  }, [existItem?.qty]);

  // In the existItem input:
  const handleQuantityBlur = () => {
    const parsed = parseInt(quantity);
    const validQty = isNaN(parsed) || parsed < 1 ? 1 : parsed;

    setQuantity(validQty.toString());

    const currentQty = existItem?.qty || 0;
    if (validQty === currentQty) return;

    startTransition(async () => {
      const res = await setItemQty(item.productId, validQty);
      if (!res.success) {
        toast.error(res.message);
        setQuantity(currentQty.toString());
      }

      toast.success(res.message, {
        icon: icon,
        action: (
          <Button
            className="bg-primary cursor-pointer text-white hover:bg-gray-800 "
            onClick={() => router.push("/cart")}
          >
            Go to Cart
          </Button>
        ),
      });
    });
  };

  return existItem ? (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>

      <Input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        onBlur={handleQuantityBlur}
        className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        disabled={isPending}
      />

      <Button
        type="button"
        variant="outline"
        onClick={handleAddToCard}
        disabled={isPending}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button
      className="w-full cursor-pointer "
      type="button"
      onClick={handleAddToCard}
      disabled={isPending}
    >
      <PlusIcon />
      Add To Cart
    </Button>
  );
};

export default AddToCart;
