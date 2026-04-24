import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  UserPlus,
  Mail,
} from "lucide-react";
import { deleteUser, getAllUsers } from "@/lib/actions/user.actions";
import { cn, formatId } from "@/lib/utils";
import DeleteDialog from "@/components/shared/delete-dialog";

export default async function UsersPage(props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) {
  const { page = "1", query: searchText } = await props.searchParams;

  const users = await getAllUsers({ page: Number(page), query: searchText });

  console.log(users);

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
          <Button asChild size="sm">
            <Link href="/admin/users/add-user">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      {/* Users Table */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{formatId(user.id)}</TableCell>
              <TableCell>
                <div className="flex gap-3 items-center">
                  <Avatar>
                    <AvatarImage src={user.image!} alt={`${user.name} image`} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  {user.name}
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    user.role === "user"
                      ? "outline"
                      : user.role === "staff"
                        ? "secondary"
                        : "default"
                  }
                  className={cn("", user.role == "driver" ? "bg-blue-500" : "")}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye />
                      View profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="flex text-center items-center gap-3"
                      >
                        <Edit />
                        Edit user
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail />
                      Send email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DeleteDialog
                      id={user.id}
                      action={deleteUser as any}
                      classNames="w-full"
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
