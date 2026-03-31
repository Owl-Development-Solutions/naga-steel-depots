import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-[300px] rounded-t-xl" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <Skeleton className="w-1/3 h-3" />
        <Skeleton className="w-2/3 h-4" />
        <div className="flex-between gap-4">
          <Skeleton className="w-16 h-3" />
          <Skeleton className="w-20 h-5" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;
