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
          "bg-[#0a54ff] hover:bg-[#0043e0]": bgColor === "bg-primary",
          "bg-[#006b8f] hover:bg-[#004d66]": bgColor === "bg-primary-secondary",
          "bg-green-800 hover:bg-green-900": bgColor === "bg-green",
          "bg-[#8f0000] hover:bg-[#660000]": bgColor === "bg-alert",
          "bg-[#008ab8] hover:bg-[#006b8f]": bgColor === "bg-accent",
          "bg-[#665419] hover:bg-[#332a0d]": bgColor === "bg-warning",
          "bg-gray-700 hover:bg-gray-800": bgColor === "bg-gray",
          "bg-[#0fc3fa] hover:bg-[#00a8e0]": bgColor === "bg-accent-secondary",
          "bg-[#E8F5E9] hover:bg-[#C8E6C9]": bgColor === "bg-light-green",
          "bg-[#ea580c] hover:bg-[#c2410c]": bgColor === "bg-deep-orange",
          "bg-[#64748b] hover:bg-[#475569]": bgColor === "bg-light-teal",
          "bg-gray-100 hover:bg-gray-200": !bgColor,
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
