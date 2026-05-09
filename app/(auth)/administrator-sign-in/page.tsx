import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSignInForm from "./admin-sign-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrator Sign In",
};

const AdminLoginPage = async () => {
  const session = await auth();

  if (session) {
    const redirectUrl =
      session.user.role === "admin"
        ? "/admin/overview"
        : session.user.role === "staff"
          ? "/staff/dashboard"
          : "/";
    return redirect(redirectUrl);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex  items-center justify-center">
            <Image
              src="/images/naga-steel-depot.png"
              width={200}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
            />
          </div>

          <CardTitle className="text-center">Administrative Portal</CardTitle>
          <CardDescription className="text-center">Sign In</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AdminSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
