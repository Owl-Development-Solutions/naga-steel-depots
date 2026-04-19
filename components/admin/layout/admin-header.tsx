"use client"

import { Bell, Search, User, Menu, X, Home, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function AdminHeader() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
          <Menu className="h-4 w-4" />
        </SidebarTrigger>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <Home className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Naga Steel Admin</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Management Dashboard</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 items-center justify-center max-w-2xl mx-8">
        <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${
            isSearchFocused ? 'text-blue-600' : 'text-gray-400'
          }`} />
          <Input
            placeholder="Search products, orders, customers, analytics..."
            className={cn(
              "h-10 pl-12 pr-4 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
              isSearchFocused && "shadow-lg shadow-blue-500/10"
            )}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
        >
          <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-white dark:border-gray-900 animate-pulse shadow-sm"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
            >
              <Avatar className="h-8 w-8 ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 transition-all duration-200">
                <AvatarImage src="/images/naga-steel-depot.png" alt="Admin" />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-64 border-gray-200 dark:border-gray-700 shadow-xl" 
            align="end" 
            forceMount
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal bg-gray-50 dark:bg-gray-800 rounded-t-lg">
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                  <AvatarImage src="/images/naga-steel-depot.png" alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold">AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">admin@nagasteel.com</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
            <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
              <User className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
              <Settings className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Admin Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
            <DropdownMenuItem className="hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 group">
              <LogOut className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-red-700 dark:group-hover:text-red-400">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
