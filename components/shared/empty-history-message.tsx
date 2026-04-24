import { LucideIcon } from "lucide-react";

const EmptyHistoryMessage = ({
  Icon,
  message,
}: {
  Icon: LucideIcon;
  message: string;
}) => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full overflow-hidden">
      <Icon className="mt-20 mb-7 icon-display" />
      <p className="text-2xl h2-bold">{message}</p>
    </div>
  );
};

export default EmptyHistoryMessage;
