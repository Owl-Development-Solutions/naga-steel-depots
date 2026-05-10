import { AuditAction, AuditEntity } from "@/lib/actions/audit.actions";
import {
  cartItemSchema,
  createUserSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductSchema,
  insertReviewSchema,
  paymentResultSchema,
  resetPasswordSchema,
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
  category?: { id: string; name: string } | null;
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
  paymentResult: PaymentResult;
};
export type PaymentResult = z.infer<typeof paymentResultSchema>;

// User types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof createUserSchema> & {
  id?: string;
  name: string;
};

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

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

//this is for audit logs!
export const ACTION_COLORS: Record<string, { badge: string; dot: string }> = {
  CREATE: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  UPDATE: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  DELETE: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  VIEW: {
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
  LOGIN: {
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
  LOGOUT: {
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-400",
  },
  EXPORT: {
    badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
  },
  STATUS_CHANGE: {
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
    dot: "bg-cyan-500",
  },
  APPROVE: {
    badge: "bg-teal-50 text-teal-700 border-teal-200",
    dot: "bg-teal-500",
  },
  REJECT: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

export const ACTIONS: AuditAction[] = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "VIEW",
  "LOGIN",
  "LOGOUT",
  "EXPORT",
  "STATUS_CHANGE",
  "APPROVE",
  "REJECT",
];

export const ENTITIES: AuditEntity[] = [
  "Product",
  "Order",
  "User",
  "Review",
  "Category",
  "ReturnRequest",
  "Cart",
  "Notification",
];

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
}
