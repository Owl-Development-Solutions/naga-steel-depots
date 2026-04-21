"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    title: "Dashboard",
    href: "/staff/dashboard",
  },
  {
    title: "Inventory",
    href: "/staff/inventory",
  },
  {
    title: "Orders",
    href: "/staff/orders",
  },
  {
    title: "Products",
    href: "/staff/products",
  },
];

const StaffNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathName = usePathname();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-color hover:text-primary",
            pathName.includes(item.href) ? "" : "text-muted-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default StaffNav;
