import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { PagesTopLoader } from "nextjs-toploader/pages";

export const metadata = {
  title: "Shopping Cart",
};

const Cart = async () => {
  const cart = await getMyCart();

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
};

export default Cart;
