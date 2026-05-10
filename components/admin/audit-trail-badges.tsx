import { Badge } from "@/components/ui/badge";
import { ACTION_COLORS } from "@/types";
import {
  Package,
  ShoppingCart,
  User,
  Star,
  LayoutGrid,
  Undo2,
  ShoppingBag,
  Bell,
} from "lucide-react";

const ENTITY_ICON_MAP: Record<string, React.ElementType> = {
  Product: Package,
  Order: ShoppingCart,
  User: User,
  Review: Star,
  Category: LayoutGrid,
  ReturnRequest: Undo2,
  Cart: ShoppingBag,
  Notification: Bell,
};

export function ActionBadge({ action }: { action: string }) {
  const colors = ACTION_COLORS[action];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold tracking-wide ${colors?.badge ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
    >
      {action.replace("_", " ")}
    </Badge>
  );
}

export function StatusDot({ status }: { status: string }) {
  const isSuccess = status === "success";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        isSuccess ? "text-emerald-600" : "text-red-500"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isSuccess ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {status}
    </span>
  );
}

export function EntityLabel({ entity }: { entity: string }) {
  const Icon = ENTITY_ICON_MAP[entity];
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
      <span>{entity}</span>
    </span>
  );
}

export function UserAvatar({
  name,
  email,
}: {
  name: string | null;
  email: string | null;
}) {
  const initial = (name ?? email ?? "?")[0].toUpperCase();
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 ring-1 ring-indigo-200">
        {initial}
      </div>
      <div className="min-w-0">
        <p className="font-medium text-slate-800 truncate max-w-[140px] text-sm">
          {name ?? "—"}
        </p>
        <p className="text-xs text-slate-400 truncate max-w-[140px]">
          {email ?? ""}
        </p>
      </div>
    </div>
  );
}
