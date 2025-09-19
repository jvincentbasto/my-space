import Link from "next/link";

import Thumbnail from "@/components/cards/Thumbnail";
import FormattedDateTime from "@/components/cards/FormattedDateTime";
import ActionDropdown from "@/components/forms/ActionDropdown";

import { fileUtils } from "@/lib/fileUtils";

const { convertFileSize } = fileUtils;

interface CardProps {
  file: Record<string, any>;
}

const Card = (props: CardProps) => {
  const { file } = props;

  const Header = () => {
    return (
      <Link href={file.url} target="_blank" className="cursor-pointer">
        <div className="flex justify-between">
          <div className="flex items-center gap-[10px]">
            <Thumbnail
              type={file.type}
              extension={file.extension}
              url={file.url}
            />
            <p className="text-[14px] font-medium">
              {convertFileSize(file.size)}
            </p>
          </div>
          <div className="flex flex-col items-end justify-between">
            <ActionDropdown file={file} />
          </div>
        </div>
      </Link>
    );
  };
  const Content = () => {
    return (
      <div className="flex flex-col gap-[5px] text-gray-800">
        <p className="text-[16px] font-semibold line-clamp-1">{file.name}</p>
        <FormattedDateTime
          date={file.$createdAt}
          className="text-[14px] font-medium leading-[1] text-gray-600"
        />
        <p className="text-[14px] line-clamp-1 text-light-200 mt-[10px]">
          By: {file.owner.fullName}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-[10px] rounded-[10px] bg-white shadow-xs transition-all hover:shadow-md p-[20px]">
      <Header />
      <hr className="mt-[10px] border-gray-200" />
      <Content />
    </div>
  );
};
export default Card;
