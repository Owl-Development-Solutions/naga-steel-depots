import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val))),
    "Price must have exactly two decimal places",
  );

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at lest 3 characters"),
  slug: z.string().min(3, "Slug must be at lest 3 characters"),
  category: z.string().min(3, "Category must be at lest 3 characters"),
  brand: z.string().min(3, "Brand must be at lest 3 characters"),
  description: z.string().min(3, "Description must be at lest 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string().min(1, "Products must have at least one image")),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Schema for signing users in
export const siginInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6  characters"),
});

export const siginUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6  characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6  characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });
