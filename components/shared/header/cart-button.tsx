"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { getMyCart } from "@/lib/actions/cart.actions";

interface CartButtonProps {
  className?: string;
  showText?: boolean;
}

export default function CartButton({ className = "", showText = true }: CartButtonProps) {
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCartCount = async () => {
    try {
      const cart = await getMyCart();
      if (cart && cart.items) {
        // Calculate total quantity of all items in cart
        const totalItems = cart.items.reduce((sum: number, item: any) => sum + item.qty, 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      // Cart might not exist or user not logged in
      setCartCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <Button asChild variant="ghost" className={`relative ${className}`}>
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {showText && <span className="ml-2">Cart</span>}
        {!isLoading && cartCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {cartCount > 99 ? '99+' : cartCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
