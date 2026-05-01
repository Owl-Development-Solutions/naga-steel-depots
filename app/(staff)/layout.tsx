import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import Menu from "@/components/shared/header/menu";
import { Input } from "@/components/ui/input";
import StaffNav from "./main.nav";
import { auth } from "@/auth";
import { getUserNotifications } from "@/lib/actions/notification.actions";
import StaffSearch from "@/components/staff/staff-search";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const notifications = await getUserNotifications(session?.user?.id as string);

  return (
    <>
      <div className="border-b container mx-auto">
        <div className="flex items-center h-16 px-4">
          <Link href="/staff/dashboard" className="w-22">
            <Image
              src="/images/naga-steel-depot.png"
              alt={`${APP_NAME} logo`}
              height={100}
              width={100}
              priority={true}
            />
          </Link>

          <StaffNav className="mx-6" />
          <div className="ml-auto items-center flex space-x-4">
            <StaffSearch />
            <Menu session={session} notifications={notifications} />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
        {children}
      </div>
    </>
  );
}
