"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const Search = ({ categories }: { categories: any }) => {
  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    router.push(`/search?category=${value}&q=`);
  };

  return (
    <form action="/search" method="GET">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Select name="category" onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="All" value="all">
              All
            </SelectItem>
            {categories.map((c: any) => (
              <SelectItem key={c.category} value={c.category}>
                {c.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          className="md:w-[100px] lg:w-[300px]"
        />
        <Button className="cursor-pointer">
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default Search;
