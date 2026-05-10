import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHOD_VALUES } from "./constants";
import parsePhoneNumberFromString from "libphonenumber-js";

const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val))),
    "Price must have exactly two decimal places",
  );

// schema for phone number PH
export const zPhone = z.string().refine((arg) => {
  const phone = parsePhoneNumberFromString(arg, {
    defaultCountry: "PH",
    extract: false,
  });

  return phone && phone.isValid();
}, "Invalid phone number");

// schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at lest 3 characters"),
  slug: z.string().optional(),
  categoryId: z.string().min(3, "Category is required"),
  brand: z.string(),
  description: z.string().min(3, "Description must be at lest 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string().min(1, "Products must have at least one image")),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
  promoPrice: currency.optional(),
  lowStockThreshold: z.coerce
    .number()
    .int()
    .positive("Threshold must be positive")
    .default(10),
  isFlagged: z.boolean().default(false),
}).refine((data) => {
  // Only validate promo price if it's provided
  if (data.promoPrice === undefined || data.promoPrice === null || data.promoPrice === "") {
    return true;
  }
  
  const price = parseFloat(data.price);
  const promoPrice = parseFloat(data.promoPrice);
  
  return promoPrice <= price;
}, {
  message: "Promo price must be less than or equal to regular price",
  path: ["promoPrice"],
});

//schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "Id is required"),
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

//Cart Schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

//schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  phoneNumber: zPhone,
  addressInformation: z.string().optional(),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

//schema for payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHOD_VALUES.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

//schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User  is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z
    .string()
    .refine((data) => PAYMENT_METHOD_VALUES.includes(data), {
      message: "Invalid payment method",
    }),
  shippingAddress: shippingAddressSchema,
});

//schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

//schema for creating user
export const createUserSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().min(1, "Role is required"),
    image: z.string().optional(),
    address: shippingAddressSchema.optional(),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6  characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

//schema for updating user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Invalid email address"),
  phoneNumber: zPhone.optional(),
});

//schema for update users (admin)
export const updateUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  image: z.string().optional(),
  // phoneNumber: zPhone.optional(),
  address: shippingAddressSchema.optional(),
});

//schema to insert reviews
export const insertReviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  productId: z.string().min(1, "Product is required"),
  userId: z.string().min(1, "User is required"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  updatedAt: z.date(),
});

//schema to insert a delivery driver
export const insertDeliveryDriver = z.object({
  driver: z.string().min(3, "Driver is required"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6  characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6  characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export const transformText = (text: string | undefined) => {
  const word = text?.split(" ").join("-").toLocaleLowerCase();

  return word;
};
