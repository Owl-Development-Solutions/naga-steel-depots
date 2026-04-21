import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
      </div>
    </div>
  );
};

export default LoadingPage;
