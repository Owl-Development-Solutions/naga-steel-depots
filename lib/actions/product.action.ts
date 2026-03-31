"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMITS } from "../constants";

//Get latest products
export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMITS,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
};

//Get single product
export const getProductBySlug = async (slug: string) => {
  return await prisma.product.findFirst({
    where: { slug },
  });
};
