"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem } from '@/types';
import { PlusIcon, MinusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useState, useTransition } from 'react';

const CartQuantityInput = ({ 
  item, 
  isPending, 
  startTransition 
}: { 
  item: CartItem; 
  isPending: boolean; 
  startTransition: React.TransitionStartFunction;
}) => {
  const [quantity, setQuantity] = useState(item.qty.toString());

  const handleIncrement = () => {
    const currentQty = parseInt(quantity) || 0;
    const newQuantity = currentQty + 1;
    setQuantity(newQuantity.toString());
    
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message);
        setQuantity(currentQty.toString());
      }
    });
  };

  const handleDecrement = () => {
    const currentQty = parseInt(quantity) || 0;
    if (currentQty <= 1) return;
    
    const newQuantity = currentQty - 1;
    setQuantity(newQuantity.toString());
    
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        toast.error(res.message);
        setQuantity(currentQty.toString());
      }
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const currentQty = item.qty;
    const difference = newQuantity - currentQty;
    
    if (difference > 0) {
      // Add items
      for (let i = 0; i < difference; i++) {
        startTransition(async () => {
          const res = await addItemToCart(item);
          if (!res.success) {
            toast.error(res.message);
          }
        });
      }
    } else if (difference < 0) {
      // Remove items
      for (let i = 0; i < Math.abs(difference); i++) {
        startTransition(async () => {
          const res = await removeItemFromCart(item.productId);
          if (!res.success) {
            toast.error(res.message);
          }
        });
      }
    }
    
    setQuantity(newQuantity.toString());
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={isPending || (parseInt(quantity) || 0) <= 1}
        className="h-8 w-8 p-0"
      >
        <MinusIcon className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={(e) => {
          const newValue = e.target.value;
          setQuantity(newValue);
          
          if (newValue === '') {
            return;
          }
          
          const newQty = parseInt(newValue) || 0;
          if (newQty >= 0) {
            handleQuantityChange(newQty);
          }
        }}
        className="w-16 text-center"
        min="0"
        disabled={isPending}
        placeholder="0"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={isPending}
        className="h-8 w-8 p-0"
      >
        <PlusIcon className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default CartQuantityInput;
