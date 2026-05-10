"use server";

import { CartItem, ShippingAddress } from "@/types";
import { cookies } from "next/headers";
import { calcPrice, convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "@/lib/validator";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/browser";
import { getUserById } from "./user.actions";
import { createAuditLog } from "./audit.actions";

const normalize = (text: string | undefined | null) =>
  (text || "").toLowerCase().replace(/[-\s]/g, "");

export async function addItemToCart(data: CartItem) {
  try {
    console.log("addItemToCart called with data:", data);

    //check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    console.log("Session cart ID:", sessionCartId);
    if (!sessionCartId) throw new Error("Cart session not found");

    //get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Only get user data if user is logged in
    let userAddress = "";
    if (userId) {
      const userData = await getUserById(userId);
      userAddress = (userData.address as ShippingAddress)?.city || "";
    }

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
      console.log("Creating new cart");
      //create new cart obj
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item], userAddress),
      });

      console.log("New cart data:", newCart);

      //add to database
      await prisma.cart.create({
        data: newCart,
      });

      console.log("New cart created in database");

      await createAuditLog({
        action: "CREATE",
        entity: "Cart",
        entityId: product.id,
        entityName: product.name,
        metadata: { productId: item.productId, qty: item.qty, sessionCartId },
      });

      //revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      console.log("Updating existing cart");
      // check if item is already in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId,
      );

      if (existItem) {
        console.log("Item exists in cart, increasing quantity");
        //check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        //increase the quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId,
        )!.qty = existItem.qty + 1;
      } else {
        console.log("Item does not exist in cart, adding new item");
        //if item does not exist in cart
        //check stock
        if (product.stock < 1) throw new Error("Not enough stock");
        //add item to the cart.items
        cart.items.push(item);
      }

      console.log("Updated cart items:", cart.items);

      //save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[], userAddress),
        },
      });

      console.log("Cart updated in database");

      await createAuditLog({
        action: existItem ? "UPDATE" : "CREATE",
        entity: "Cart",
        entityId: cart.id,
        entityName: product.name,
        changes: existItem
          ? { qty: { old: existItem.qty, new: existItem.qty + 1 } }
          : undefined,
        metadata: { productId: item.productId, sessionCartId },
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

  // Only get user data if user is logged in
  let userAddress = "";
  if (userId) {
    const userData = await getUserById(userId);
    userAddress = (userData.address as ShippingAddress)?.city || "";
  }

  const inside = normalize(userAddress).includes("lapulapu");

  const shippingPrice = round2(inside ? 0 : 500);

  //get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  //custom total price
  const totalPriceOrder = Number(cart?.itemsPrice) + Number(shippingPrice);

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

    // Only get user data if user is logged in
    let userAddress = "";
    if (userId) {
      const userData = await getUserById(userId);
      userAddress = (userData.address as ShippingAddress)?.city || "";
    }

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

export async function setItemQty(productId: string, newQty: number) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) {
      return { success: false, message: "Product not found" };
    }

    if (product.stock < newQty) {
      return { success: false, message: "Not enough stock" };
    }

    const cart = await getMyCart();
    if (!cart) {
      return { success: false, message: "Cart not found" };
    }

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Only get user data if user is logged in
    let userAddress = "";
    if (userId) {
      const userData = await getUserById(userId);
      userAddress = (userData.address as ShippingAddress)?.city || "";
    }

    const items = cart.items as CartItem[];
    const existItem = items.find((x) => x.productId === productId);

    if (!existItem) {
      return { success: false, message: "Item not found in the cart" };
    }

    if (newQty <= 0) {
      // Remove item entirely
      cart.items = items.filter((x) => x.productId !== productId);
    } else {
      existItem.qty = newQty;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[], userAddress),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return { success: true, message: `${product.name} quantity updated` };
  } catch (error) {
    console.log(formatError(error));

    return { success: false, message: formatError(error) };
  }
}

export async function updateSelectedItems(selectedIds: string[]) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        itemSelected: selectedIds,
      },
    });

    revalidatePath("/cart");

    return { success: true, message: "Selected items updated" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function removeSelectedItems() {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    await prisma.cart.update({
      where: { id: cart.id },
      data: { itemSelected: [] },
    });

    revalidatePath("/cart");

    return { success: true, message: "Selection cleared" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId,
    );
    if (!exist) throw new Error("Item not found");

    // Remove entirely regardless of qty
    cart.items = (cart.items as CartItem[]).filter(
      (x) => x.productId !== productId,
    );

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Only get user data if user is logged in
    let userAddress = "";
    if (userId) {
      const userData = await getUserById(userId);
      userAddress = (userData.address as ShippingAddress)?.city || "";
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        itemSelected: cart.itemSelected.filter((id) => id !== productId),
        ...calcPrice(cart.items as CartItem[], userAddress),
      },
    });

    revalidatePath("/cart");

    return { success: true, message: `${product.name} removed from cart` };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
