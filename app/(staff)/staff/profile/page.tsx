import { auth } from "@/auth";
import { Metadata } from "next";

import { SessionProvider } from "next-auth/react";
import ProfileFormPage from "./staff-profile-form";
import { requireStaff } from "@/lib/auth-guard";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();

  return {
    title: `${session?.user?.name ?? "User"} Customer Profile`,
  };
}

const StaffProfilePage = async () => {
  await requireStaff();
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="h2-bold">Profile</h2>
        <ProfileFormPage />
      </div>
    </SessionProvider>
  );
};

export default StaffProfilePage;
