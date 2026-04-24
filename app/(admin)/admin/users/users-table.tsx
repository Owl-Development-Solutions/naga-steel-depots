"use client";

import { deleteUser } from "@/lib/actions/user.actions";
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
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatId } from "@/lib/utils";
import { Edit, Eye, MoreHorizontal, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Badge } from "@/components/ui/badge";
import EmptyHistoryMessage from "@/components/shared/empty-history-message";
import { UserModal } from "@/components/shared/user-modal";
import { useState } from "react";

const UsersAdminTable = ({ users }: { users: any }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <>
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
          {users.length ? (
            users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id!)}</TableCell>
                <TableCell>
                  <div className="flex gap-3 items-center">
                    <Avatar>
                      <AvatarImage
                        src={user.image!}
                        alt={`${user.name} image`}
                      />
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
                      user?.role === "user"
                        ? "outline"
                        : user?.role === "staff"
                          ? "secondary"
                          : "default"
                    }
                    className={cn(
                      "",
                      user.role == "driver" ? "bg-blue-500" : "",
                    )}
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
                      <DropdownMenuItem onClick={() => handleViewProfile(user)}>
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
                      {/* <DropdownMenuItem>
                        <Mail />
                        Send email
                      </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      <DeleteDialog
                        id={user.id!}
                        action={deleteUser as any}
                        classNames="w-full"
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9999} className="h-75">
                <EmptyHistoryMessage
                  Icon={UserIcon}
                  message="No records available in the user catalog"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <UserModal
        user={selectedUser!}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default UsersAdminTable;
