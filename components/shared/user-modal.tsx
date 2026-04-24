"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserModalProps {
  user: {
    id?: string;
    name: string;
    email: string;
    role: string;
    image?: string;
    address?: {
      fullName?: string;
      phoneNumber?: string;
      streetAddress?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserModal({ user, open, onOpenChange }: UserModalProps) {
  const roleBadgeVariant =
    user?.role === "user"
      ? "outline"
      : user?.role === "staff"
        ? "secondary"
        : user?.role === "driver"
          ? "default"
          : "default";

  const roleBadgeClass = user?.role === "driver" ? "bg-blue-500" : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            User Profile
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 pt-4">
          {/* Profile Image */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback className="text-lg">
              {user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Full Name */}
          <div className="text-center">
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <Badge
              variant={roleBadgeVariant}
              className={cn("mt-1", roleBadgeClass)}
            >
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </Badge>
          </div>
        </div>

        <Separator className="my-4" />

        {/* User Details */}
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Contact Number */}
          {user?.address?.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Contact Number</p>
                <p className="text-sm text-muted-foreground">
                  {user?.address?.phoneNumber}
                </p>
              </div>
            </div>
          )}

          {/* Address */}
          {(user?.address?.streetAddress ||
            user?.address?.city ||
            user?.address?.postalCode ||
            user?.address?.country) && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Address</p>
                  <div className="text-sm text-muted-foreground">
                    {user?.address?.streetAddress && (
                      <p>{user?.address?.streetAddress}</p>
                    )}
                    {(user?.address?.city ||
                      user?.address?.postalCode ||
                      user?.address?.country) && (
                      <p>
                        {[
                          user?.address?.city,
                          user?.address?.postalCode,
                          user?.address?.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
