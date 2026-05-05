import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/lib/actions/user.actions";
import UsersAdminTable from "./users-table";
import { UserPlus } from "lucide-react";
import { requireAdmin } from "@/lib/auth-guard";

export default async function UsersPage(props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) {
  await requireAdmin();
  const { page = "1", query: searchText } = await props.searchParams;

  const users = await getAllUsers({ page: Number(page), query: searchText });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex gap-2">
          {searchText && (
            <div>
              Filtered by <i>&quot;{searchText}&quot;</i>
              <Link href="/admin/users">
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-3 cursor-pointer"
                >
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}

          <Button asChild size="sm">
            <Link href="/admin/users/add-user">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      {/* Users Table */}
      {users.data && <UsersAdminTable users={users.data} />}
    </div>
  );
}
