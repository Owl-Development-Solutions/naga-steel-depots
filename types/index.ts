import {
  cartItemSchema,
  createUserSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductSchema,
  insertReviewSchema,
  paymentResultSchema,
  shippingAddressSchema,
  updateUserSchema,
} from "@/lib/validator";
import { z } from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews?: number;
  createdAt: Date;
  _count?: any;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: Boolean;
  paidAt: Date | null;
  isDelivered: Boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
};
export type PaymentResult = z.infer<typeof paymentResultSchema>;

// User types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof createUserSchema> & {
  id?: string;
  name: string;
};

// Category types
export type CategoryCount = {
  category: string | null;
  _count: number;
};

export type ProductWithComputed = {
  price: string;
  rating: string;
} & z.infer<typeof insertProductSchema> & {
    id: string;
    createdAt: Date;
    numReviews: number;
    _count: number;
  };

export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string; image?: string };
};
