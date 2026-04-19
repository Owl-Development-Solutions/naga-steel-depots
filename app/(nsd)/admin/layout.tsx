import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebarFixed } from "@/components/admin/layout/admin-sidebar-fixed"
import { AdminHeader } from "@/components/admin/layout/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
        <AdminSidebarFixed />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
