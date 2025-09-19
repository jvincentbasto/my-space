"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { sortTypes } from "@/constants";
import { cn } from "@/lib/utils";

interface SortProps {}

const Sort = (props: SortProps) => {
  const {} = props;

  const path = usePathname();
  const router = useRouter();

  const handleSort = (value: string) => {
    router.push(`${path}?sort=${value}`);
  };

  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="w-full h-[50px] rounded-[8px] bg-white shadow-md border-none outline-none focus-visible:ring-transparent hover:cursor-pointer">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className="p-[10px] bg-white shadow-md">
        {/* <SelectItem
          key={"default"}
          className={cn(["focus:bg-gray-100 cursor-pointer"])}
          value={"default"}
          defaultChecked={true}
          disabled={true}
        >
          Sort
        </SelectItem> */}
        {sortTypes.map((sort) => (
          <SelectItem
            key={sort.label}
            className={cn([
              "font-medium text-gray-600 focus:bg-gray-100 cursor-pointer line-clamp-1",
            ])}
            value={sort.value}
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
