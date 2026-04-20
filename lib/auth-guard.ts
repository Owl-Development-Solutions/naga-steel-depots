import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/unauthorized");
  }

  return session;
}

export async function requireStaff() {
  const session = await auth();

  if (session?.user?.role !== "staff") {
    redirect("/unauthorized");
  }

  return session;
}
