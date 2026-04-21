"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const handleClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    const params = new URLSearchParams(searchParams);

    params.set(urlParamName || "page", pageValue.toString());

    router.replace(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button
        size="default"
        variant="outline"
        className="w-28 cursor-pointer"
        disabled={Number(page) <= 1}
        onClick={() => handleClick("prev")}
      >
        Previous
      </Button>

      <Button
        size="default"
        variant="outline"
        className="w-28 cursor-pointer"
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick("next")}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
