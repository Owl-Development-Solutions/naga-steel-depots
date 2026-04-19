"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings,
  LogOut,
  Building,
  TrendingUp,
  FileText,
  Shield
} from "lucide-react"
import Image from "next/image"

const mainNavigation = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
  },
]

const systemNavigation = [
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: TrendingUp,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: FileText,
    color: "text-pink-600",
    bgColor: "bg-pink-100 dark:bg-pink-900/20",
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-900/20",
  },
  {
    title: "Security",
    url: "/admin/security",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20",
  },
]

export function AdminSidebarFixed() {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" className="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <SidebarHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-white/50 dark:hover:bg-gray-800/50">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
                  <Building className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-gray-900 dark:text-white">Naga Steel</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="bg-white dark:bg-gray-800 px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-700 dark:text-blue-200 font-semibold text-xs uppercase tracking-wider px-4">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    className={cn(
                      "group relative w-full h-10 rounded-lg transition-all duration-200",
                      pathname === item.url 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-4 w-full">
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300",
                        pathname === item.url 
                          ? `${item.bgColor} ${item.color} shadow-sm` 
                          : "bg-blue-100/50 text-blue-700 group-hover:bg-blue-200"
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className={cn(
                          "font-semibold text-sm transition-colors duration-300",
                          pathname === item.url 
                            ? "text-gray-900" 
                            : "text-blue-700 group-hover:text-gray-900"
                        )}>
                          {item.title}
                        </span>
                        {pathname === item.url && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full" />
                        )}
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-blue-700 dark:text-blue-200 font-semibold text-xs uppercase tracking-wider px-4">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {systemNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    className={cn(
                      "group relative mx-2 h-11 rounded-xl transition-all duration-300 hover:scale-[1.02]",
                      pathname === item.url 
                        ? "bg-white shadow-md border border-blue-200" 
                        : "hover:bg-blue-100/50 border border-transparent"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3 w-full">
                      <div className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300",
                        pathname === item.url 
                          ? `${item.bgColor} ${item.color} shadow-sm` 
                          : "bg-blue-100/50 text-blue-700 group-hover:bg-blue-200"
                      )}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className={cn(
                        "font-medium text-sm transition-colors duration-300",
                        pathname === item.url 
                          ? "text-gray-900" 
                          : "text-blue-700 group-hover:text-gray-900"
                      )}>
                        {item.title}
                      </span>
                      {pathname === item.url && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="group relative mx-2 h-11 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-red-100/50 border border-transparent"
                >
                  <Link href="/sign-out" className="flex items-center gap-3 w-full">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-100/50 text-red-600 group-hover:bg-red-200 transition-all duration-300">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm text-gray-700 group-hover:text-red-700 transition-colors duration-300">
                      Logout
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-3 py-4">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="relative">
            <Image
              src="/images/naga-steel-depot.png"
              alt="Naga Steel Depots"
              width={40}
              height={40}
              className="rounded-xl shadow-md ring-2 ring-blue-200"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">Naga Steel Depots</span>
            <span className="text-xs text-gray-600">Admin Dashboard v2.0</span>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
