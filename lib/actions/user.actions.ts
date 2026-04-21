"use server";

import {
  paymentMethodSchema,
  shippingAddressSchema,
  siginInFormSchema,
  siginUpFormSchema,
} from "../validator";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { convertToPlainObject, formatError } from "../utils";
import z from "zod";
import { ShippingAddress } from "@/types";

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = siginInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Find user to check role before signing in
    const dbUser = await prisma.user.findFirst({
      where: { email: user.email as string },
    });

    await signIn("credentials", {
      ...user,
      callbackUrl:
        dbUser?.role === "admin"
          ? "/admin/overview"
          : dbUser?.role === "staff"
            ? "/staff/dashboard"
            : "/products",
    });

    return { success: true, message: "Sign in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "Invalid email or password",
    };
  }
}

// Sign user out
export async function signOutUser() {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";
  const isStaff = session?.user.role === "staff";
  if (isAdmin || isStaff) {
    await signOut({ redirectTo: "/sign-in" });
  } else {
    await signOut();
  }
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = siginUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
      callbackUrl: "/products",
    });

    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  return user;
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export const getUserCardDetails = async () => {
  try {
    const now = new Date();

    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 7);

    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    const [totalUsers, activeUsers, newUsers, adminUsers] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          updatedAt: {
            gte: last30Days,
          },
        },
      }),

      prisma.user.count({
        where: {
          createdAt: {
            gte: last7Days,
          },
        },
      }),

      prisma.user.count({
        where: {
          role: "admin",
        },
      }),
    ]);

    const data = [
      {
        title: "Total Users",
        icon: "users",
        amount: totalUsers.toString(),
        description: "All registered users",
        bgColor: "bg-primary",
      },
      {
        title: "Active Users",
        icon: "activity",
        amount: activeUsers.toString(),
        description: "Active in last 30 days",
        bgColor: "bg-green",
      },
      {
        title: "New Users",
        icon: "userPlus",
        amount: newUsers.toString(),
        description: "Joined in last 7 days",
        bgColor: "bg-accent",
      },
      {
        title: "Admin Users",
        icon: "shield",
        amount: adminUsers.toString(),
        description: "Users with admin role",
        bgColor: "bg-primary-secondary",
      },
    ];

    return {
      success: true,
      data: convertToPlainObject(data),
    };
  } catch (error) {
    return {
      success: false,
      message: await formatError(error),
    };
  }
};
