"use client";

import { Button } from "@/components/ui/button";
import { removeSelectedItems } from "@/lib/actions/cart.actions";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const CancelOrderButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    startTransition(async () => {
      const res = await removeSelectedItems();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      router.push("/cart");
    });
  };

  return (
    <Button
      className="w-full"
      variant="destructive"
      disabled={isPending}
      onClick={handleCancel}
    >
      <X />
      {isPending ? "Cancelling..." : "Cancel Order"}
    </Button>
  );
};

export default CancelOrderButton;
