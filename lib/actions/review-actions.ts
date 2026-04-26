"use server";

import z from "zod";
import { insertReviewSchema } from "../validator";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

// create and update reviews
export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>,
) {
  try {
    const session = await auth();

    if (!session) throw new Error("User is not authenticated");

    // Validate and store the review
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id,
    });

    // get product that is being reviewed
    const product = await prisma.product.findFirst({
      where: {
        id: review.productId,
      },
    });

    if (!product) throw new Error("Product not found");

    // check if user already reviewd
    const reviewExist = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExist) {
        // update review
        await tx.review.update({
          where: { id: reviewExist.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
            updatedAt: review.updatedAt,
          },
        });
      } else {
        // create review
        await tx.review.create({
          data: review,
        });
      }

      // get the avg rating
      const avgRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: {
          productId: review.productId,
        },
      });

      // get the number of reviews
      const numReviews = await tx.review.count({
        where: {
          productId: review.productId,
        },
      });

      // update the rating and numreviews and product table
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: avgRating._avg.rating || 0,
          numReviews,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Review updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// get all reviews for a product
export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: {
      productId: productId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return { data };
}

// get a review written by the current user
export async function getReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const session = await auth();

  if (!session) throw new Error("User is not authenticated");

  return await prisma.review.findFirst({
    where: {
      productId: productId,
      userId: session?.user?.id,
    },
  });
}

// check if user has purchased a product (via delivered order)
export async function hasUserPurchasedProduct({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const purchasedOrder = await prisma.order.findFirst({
    where: {
      userId: userId,
      isDelivered: true,
      orderitems: {
        some: {
          productId: productId,
        },
      },
    },
  });

  return !!purchasedOrder;
}
