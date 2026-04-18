"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { InfoIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

const AddToCartItemButton = ({
  item,
  isPending,
  startTransition,
}: {
  item: CartItem;
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
}) => {
  const icon = (
    <InfoIcon className="text-rose-500 w-5 h-5 rounded-full bg-rose-100" />
  );

  return (
    <Button
      disabled={isPending}
      variant="outline"
      type="button"
      onClick={() =>
        startTransition(async () => {
          const res = await addItemToCart(item);

          if (!res.success) {
            toast.error(res.message, {
              icon: icon,
            });
          }
        })
      }
    >
      <PlusIcon className="w-4 h-4" />
    </Button>
  );
};

export default AddToCartItemButton;
