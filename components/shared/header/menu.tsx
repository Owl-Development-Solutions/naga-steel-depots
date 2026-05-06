import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import { Bell, EllipsisVertical } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";
import { Session } from "next-auth";
import NotificationBell from "./notification-bell";
import CartButton from "./cart-button";

const Menu = ({
  session,
  notifications,
}: {
  session: Session | null;
  notifications?: any;
}) => {
  const isRestricted =
    session?.user?.role === "admin" || session?.user?.role === "staff";

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        {/* <ModeToggle /> */}
        {!isRestricted && (
          <div className="mr-2">
            <CartButton />
          </div>
        )}

        {isRestricted && (
          <NotificationBell session={session} notifications={notifications} />
        )}

        <UserButton session={session} />
      </nav>

      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start p-6">
            <SheetTitle>Menu</SheetTitle>
            {/* <ModeToggle /> */}
            {!isRestricted && (
              <div>
                <CartButton />
              </div>
            )}
            <UserButton session={session} />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
