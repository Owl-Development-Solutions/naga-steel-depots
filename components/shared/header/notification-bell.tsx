"use client";

import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NotificationBell = ({
  session,
  notifications,
}: {
  session: Session;
  notifications: any;
}) => {
  const unreadCount = notifications?.data?.filter((n: any) => !n.isRead).length;
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center"
            >
              <Bell className="w-5 h-5" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </Button>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
          <DropdownMenuLabel className="text-sm text-gray-500">
            Notifications
          </DropdownMenuLabel>

          <div className="px-2 py-1.5 text-sm">
            You have{" "}
            <span className="font-semibold text-black">{unreadCount}</span>{" "}
            unread notification{unreadCount !== 1 ? "s" : ""}
          </div>

          <div className="border-t my-1" />

          <DropdownMenuItem>
            <Link
              href={
                session?.user?.role === "admin"
                  ? "/admin/notifications"
                  : "/staff/notifications"
              }
              className="cursor-pointer "
            >
              <span className="text-[#114965]">Go to notifications</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationBell;
