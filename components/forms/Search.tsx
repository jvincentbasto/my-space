"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import Thumbnail from "@/components/cards/Thumbnail";
import FormattedDateTime from "@/components/cards/FormattedDateTime";

import { useDebounce } from "use-debounce";
import { getFiles } from "@/lib/actions/file.actions";

interface SearchProps {}

const Search = (props: SearchProps) => {
  // const {} = props

  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Record<string, any>[]>([]);
  const [open, setOpen] = useState(false);

  const [debouncedQuery] = useDebounce(query, 300);

  // use effects
  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }

      const files = await getFiles({ types: [], searchText: debouncedQuery });
      // const currentFiles = files.documents
      const currentFiles = files.rows;

      setResults(currentFiles);
      setOpen(true);
    };

    fetchFiles();
  }, [debouncedQuery]);
  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  // hanlders
  const handleClickItem = (file: Record<string, any>) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`
    );
  };

  const Results = () => {
    if (!open) return null;

    const Item = (props: Record<string, any>) => {
      const { file } = props;

      return (
        <li
          className="flex items-center justify-between gap-[10px] transition-all hover:scale-[102%]"
          key={file.$id}
          onClick={() => handleClickItem(file)}
        >
          <div className="w-full cursor-pointer flex items-center gap-[20px] ">
            <Thumbnail
              type={file.type}
              extension={file.extension}
              url={file.url}
              className="size-[40px] min-w-[40px]"
            />
            <p className="text-[16px] line-clamp-1 text-gray-800">
              {file.name}
            </p>
          </div>
          {/* <div className="min-w-[110px]">
            <FormattedDateTime
              date={file.$createdAt}
              className="text-[14px] line-clamp-1 text-gray-400"
            />
          </div> */}
        </li>
      );
    };

    return (
      <ul className="w-full flex flex-col gap-[10px] rounded-[10px] bg-gray-50 p-[20px] absolute left-0 top-[60px] z-50 shadow-lg">
        {results.length > 0 ? (
          results.map((file, i) => {
            return <Item key={file.type + i} file={file} />;
          })
        ) : (
          <div className="w-full h-[100px] flex justify-center items-center">
            <p className="text-[20px] font-bold text-center text-gray-400">
              No Results
            </p>
          </div>
        )}
      </ul>
    );
  };

  return (
    <div className="relative w-full md:max-w-[480px] rounded-[10px] bg-white shadow-md">
      <div className="w-full h-[52px] flex items-center gap-[10px] px-[10px]">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          id="query"
          name="query"
          className="w-full text-[16px] p-0 shadow-none border-none outline-none focus-visible:ring-transparent"
          onChange={(e) => setQuery(e.target.value)}
        />

        <Results />
      </div>
    </div>
  );
};

export default Search;
