"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

const StaffSearch = () => {
  const pathName = usePathname();

  const formActionUrl = pathName.includes("/staff/orders")
    ? "/staff/orders"
    : pathName.includes("/staff/inventory")
      ? "/staff/inventory"
      : "/staff/products";

  const searchParams = useSearchParams();

  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="search..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="md:w-[100px] lg:w-[300px]"
      />

      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  );
};

export default StaffSearch;
