"use client";

import { Review } from "@/types";
import Link from "next/link";
import { useState } from "react";
import ReviewForm from "./review-form";
import { useEffect } from "react";
import {
  getReviews,
  hasUserPurchasedProduct,
} from "@/lib/actions/review-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/rating";

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId?: string | null;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({ productId });
      setReviews(res.data);
    };

    loadReviews();
  }, [productId]);

  useEffect(() => {
    const checkPurchase = async () => {
      if (userId) {
        const purchased = await hasUserPurchasedProduct({ productId, userId });
        setHasPurchased(purchased);
      }
    };

    checkPurchase();
  }, [productId, userId]);

  const reload = async () => {
    const res = await getReviews({ productId });

    setReviews([...res.data]);
  };

  const userReview = reviews.find((r) => r.userId === userId);
  const hasReview = !!userReview;

  console.log(hasPurchased);

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No Reviews yet</div>}

      {userId ? (
        hasPurchased ? (
          <ReviewForm
            userId={userId}
            productId={productId}
            onReviewSubmitted={reload}
            hasReview={hasReview}
          />
        ) : (
          <div className="mt-3 text-muted-foreground">
            You need to purchase this product to write a review
          </div>
        )
      ) : (
        <div className="mt-3">
          Please
          <Link
            className="text-blue-700 px-1"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            sign in
          </Link>
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  {review.user ? review.user.name : "Delete User"}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
