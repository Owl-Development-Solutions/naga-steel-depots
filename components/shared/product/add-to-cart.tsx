'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cart, CartItem } from '@/types';
import { CheckIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const icon = (
    <CheckIcon className='text-green-500 w-5 h-5 rounded-full bg-green-100' />
  );

  const [isPending, startTransition] = useTransition();

  //check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);
  
  const [quantity, setQuantity] = useState((existItem?.qty || 1).toString());

  const handleAddToCard = async () => {
    console.log('Add to Cart clicked - calling database operation');
    
    startTransition(async () => {
      console.log('Starting database operation for item:', item);
      const res = await addItemToCart(item);
      console.log('Database operation result:', res);

      if (!res.success) {
        console.error('Database operation failed:', res.message);
        toast.error(res.message);
        return;
      }

      console.log('Database operation successful');
      //handle success add to cart
      toast.success(res.message, {
        icon: icon,
        action: (
          <Button
            className='bg-primary cursor-pointer text-white hover:bg-gray-800 '
            onClick={() => router.push('/cart')}
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

  const handleIncrement = () => {
    const currentQty = parseInt(quantity) || 0;
    const newQuantity = currentQty + 1;
    setQuantity(newQuantity.toString());
    
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message);
        // Revert on error
        setQuantity(currentQty.toString());
      }
    });
  };

  const handleDecrement = () => {
    const currentQty = parseInt(quantity) || 0;
    if (currentQty <= 1) return; // Prevent going below 1
    
    const newQuantity = currentQty - 1;
    setQuantity(newQuantity.toString());
    
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        toast.error(res.message);
        // Revert on error
        setQuantity(currentQty.toString());
      }
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const currentQty = existItem?.qty || 0;
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

  return existItem ? (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={isPending || (existItem?.qty || 1) <= 1}
        className="h-8 w-8 p-0"
      >
        <MinusIcon className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        value={existItem?.qty || quantity}
        onChange={(e) => {
          const newValue = e.target.value;
          setQuantity(newValue);
          
          if (newValue === '') {
            // Don't update cart when field is empty
            return;
          }
          
          const newQty = parseInt(newValue) || 1;
          if (newQty >= 1) {
            handleQuantityChange(newQty);
          }
        }}
        className="w-16 text-center"
        min="1"
        disabled={isPending}
        placeholder="1"
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
  ) : (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const currentQty = parseInt(quantity) || 1;
            if (currentQty <= 1) return;
            const newQty = currentQty - 1;
            setQuantity(newQty.toString());
          }}
          disabled={isPending}
          className="h-8 w-8 p-0"
        >
          <MinusIcon className="h-3 w-3" />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => {
            const newValue = e.target.value;
            
            // Allow empty input for editing
            if (newValue === '') {
              setQuantity('');
              return;
            }
            
            // Validate and update
            const parsedValue = parseInt(newValue);
            if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 99) {
              setQuantity(parsedValue.toString());
            } else if (newValue === '0') {
              // Prevent 0 but allow typing it
              setQuantity('0');
            }
          }}
          onBlur={() => {
            // Validate on blur - ensure minimum 1
            const currentQty = parseInt(quantity) || 1;
            if (currentQty < 1) {
              setQuantity('1');
            } else {
              setQuantity(currentQty.toString());
            }
          }}
          className="flex-1 text-center"
          min="1"
          max="99"
          disabled={isPending}
          placeholder="1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const currentQty = parseInt(quantity) || 1;
            const newQty = currentQty + 1;
            setQuantity(newQty.toString());
          }}
          disabled={isPending}
          className="h-8 w-8 p-0"
        >
          <PlusIcon className="h-3 w-3" />
        </Button>
      </div>
      <Button
        className='w-full cursor-pointer'
        type='button'
        onClick={() => {
          const qty = parseInt(quantity) || 1;
          if (qty < 1) {
            toast.error('Please enter a valid quantity');
            return;
          }
          
          // Add the specified quantity
          startTransition(async () => {
            for (let i = 0; i < qty; i++) {
              const res = await addItemToCart(item);
              if (!res.success) {
                toast.error(res.message);
                return;
              }
            }
            
            toast.success(`${qty} ${item.name} added to cart`, {
              icon: icon,
              action: (
                <Button
                  className='bg-primary cursor-pointer text-white hover:bg-gray-800 '
                  onClick={() => router.push('/cart')}
                >
                  Go to Cart
                </Button>
              ),
            });
          });
        }}
        disabled={isPending}
      >
        <PlusIcon />
        Add To Cart
      </Button>
    </div>
  );
};

export default AddToCart;
