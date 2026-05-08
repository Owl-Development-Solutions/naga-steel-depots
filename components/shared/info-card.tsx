import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

const InfoCardDetails = ({
  title,
  icon: Icon,
  amount,
  description,
  bgColor,
}: {
  title: string;
  icon: LucideIcon;
  amount: string;
  description?: string;
  bgColor?: string;
}) => {
  return (
    <div
      className={cn(
        "grow p-4 min-h-[128px] relative transition-colors",

        {
          "bg-[#0a54ff]": bgColor === "bg-primary",
          "bg-[#006b8f]": bgColor === "bg-primary-secondary",
          "bg-green-800": bgColor === "bg-green",
          "bg-[#8f0000]": bgColor === "bg-alert",
          "bg-[#008ab8]": bgColor === "bg-accent",
          "bg-[#665419]": bgColor === "bg-warning",
          "bg-gray-700": bgColor === "bg-gray",
          "bg-[#0fc3fa]": bgColor === "bg-accent-secondary",
          "bg-[#E8F5E9]": bgColor === "bg-light-green",
          "bg-[#ea580c]": bgColor === "bg-deep-orange",
          "bg-[#64748b]": bgColor === "bg-light-teal",
          "bg-gray-100": !bgColor,
          "text-white": !!bgColor,
        },
      )}
    >
      <h2 className="text-sm z-1 opacity-75">{title}</h2>

      <div className="flex justify-between items-center mt-6">
        <span className="text-4xl">{amount}</span>

        <Icon
          className={cn("icon-display absolute left-[70%] bottom-[30%]", {
            "text-white": bgColor,
            "text-gray-500": !bgColor,
          })}
        />
      </div>
      <span className="text-sm">{description}</span>
    </div>
  );
};

export default InfoCardDetails;
