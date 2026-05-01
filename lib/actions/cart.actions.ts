"use server";

import { CartItem, ShippingAddress } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "@/lib/validator";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/browser";
import { getUserById } from "./user.actions";

const normalize = (text: string) => text.toLowerCase().replace(/[-\s]/g, "");

// calculate cart prices
const calcPrice = (items: CartItem[], city: string) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
  );

  const inside = normalize(city).includes("lapulapu");

  const shippingPrice = round2(inside ? 0 : 500);

  const taxPrice = 0;

  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    //check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Cart session not found");

    //get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const userData = await getUserById(userId as string);
    const userAddress = (userData.address as ShippingAddress).city;

    console.log(userAddress);

    //get cart
    const cart = await getMyCart();

    //parse and validate item
    const item = cartItemSchema.parse(data);

    //find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not Found");

    if (!cart) {
      //create new cart obj
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item], userAddress),
      });

      //add to database
      await prisma.cart.create({
        data: newCart,
      });

      //revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // check if item is already in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId,
      );

      if (existItem) {
        //check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        //increase the quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId,
        )!.qty = existItem.qty + 1;
      } else {
        //if item does not exist in cart
        //check stock
        if (product.stock < 1) throw new Error("Not enough stock");
        //add item to the cart.items
        cart.items.push(item);
      }

      //save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[], userAddress),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) throw new Error("Cart session not found");

  //get session and user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const userData = await getUserById(userId as string);
  const userAddress = (userData.address as ShippingAddress).city;

  const inside = normalize(userAddress).includes("lapulapu");

  const shippingPrice = round2(inside ? 0 : 500);

  //get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  //custom total price
  const totalPriceOrder = inside
    ? cart.totalPrice.toString()
    : Number(cart?.itemsPrice) + Number(shippingPrice);

  console.log("total", totalPriceOrder);

  //convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: totalPriceOrder.toString(),
    shippingPrice: shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Cart session not found");

    //get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    //get user cart
    const cart = await getMyCart();

    if (!cart) throw new Error("Cart not found");

    //check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId,
    );

    if (!exist) throw new Error("Item not found");

    //check if only one in qty
    if (exist.qty === 1) {
      //remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId,
      );
    } else {
      //decrease the qty
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1;
    }

    //get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;
    const userData = await getUserById(userId as string);
    const userAddress = (userData.address as ShippingAddress).city;

    //update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[], userAddress),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from the cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
