import { CreateUserInput } from "@/types";
import { Banknote, CreditCard, Wallet } from "lucide-react";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Naga steel Depots";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "E-commerce specialized in selling steel and construction materials";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMITS =
  Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  phoneNumber: "",
  addressInformation: "",
  city: "",
  postalCode: "",
  country: "",
};

export const PAYMENT_METHODS = [
  {
    id: "paypal",
    value: "Paypal",
    label: "PayPal",
    description: "Pay securely using your PayPal account",
    icon: Wallet,
    color: "text-[#001C64]",
  },
  {
    id: "stripe",
    value: "Stripe",
    label: "Stripe",
    description: "Pay using credit or debit card via Stripe",
    icon: CreditCard,
    color: "text-[#533AFD]",
  },
  {
    id: "cash_on_delivery",
    value: "CashOnDelivery",
    label: "Cash on Delivery",
    description: "Pay with cash upon delivery",
    icon: Banknote,
    color: "text-green-600",
  },
];

export const PAYMENT_METHOD_VALUES = PAYMENT_METHODS.map((m) => m.value);

export const DEFAULT_PAYMENT_METHOD = process.env.PAYMENT_METHODS || "Paypal";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

export const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReviews: "0",
  isFeatured: false,
  banner: null,
};

export const userCreateDefaultValues: CreateUserInput = {
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  image: "",
  address: {
    fullName: "",
    streetAddress: "",
    phoneNumber: "",
    addressInformation: "",
    city: "",
    postalCode: "",
    country: "",
  },
};

export const reviewFormDefaultValues = {
  title: "",
  comment: "",
  rating: 0,
  updatedAt: new Date(),
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";
