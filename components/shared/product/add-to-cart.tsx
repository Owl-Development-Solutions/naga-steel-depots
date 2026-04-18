'use client';

import { Button } from '@/components/ui/button';
import { Cart, CartItem } from '@/types';
import { CheckIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const icon = (
    <CheckIcon className='text-green-500 w-5 h-5 rounded-full bg-green-100' />
  );

  const [isPending, startTransition] = useTransition();

  const handleAddToCard = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);

        return;
      }

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

  //check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button
        type='button'
        variant='outline'
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        <MinusIcon className='h-4 w-4' />
      </Button>
      <span className='px-2'>{existItem.qty}</span>
      <Button
        type='button'
        variant='outline'
        onClick={handleAddToCard}
        disabled={isPending}
      >
        <PlusIcon className='h-4 w-4' />
      </Button>
    </div>
  ) : (
    <Button
      className='w-full cursor-pointer '
      type='button'
      onClick={handleAddToCard}
      disabled={isPending}
    >
      <PlusIcon />
      Add To Cart
    </Button>
  );
};

export default AddToCart;
