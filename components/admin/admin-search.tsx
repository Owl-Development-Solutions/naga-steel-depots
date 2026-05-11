"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

const AdminSearch = () => {
  const pathName = usePathname();

  const formActionUrl = pathName.includes("/admin/orders")
    ? "/admin/orders"
    : pathName.includes("/admin/users")
      ? "/admin/users"
      : "/admin/products";

  const searchParams = useSearchParams();

  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

};

export default AdminSearch;
