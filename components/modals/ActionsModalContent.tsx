import Image from "next/image";

import { Input } from "@/components/ui/input";

import Thumbnail from "@/components/cards/Thumbnail";
import FormattedDateTime from "@/components/cards/FormattedDateTime";

import { formatDateTime } from "@/lib/utils";
import { fileUtils } from "@/lib/fileUtils";

const { convertFileSize } = fileUtils;

type FileType = Record<string, any>;
interface ImageThumbnailProps {
  file: FileType;
}
interface FileDetailsProps {
  file: FileType;
}
interface ShareInputProps {
  file: FileType;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}

const ImageThumbnail = (props: ImageThumbnailProps) => {
  const { file } = props;

  return (
    <div className="flex items-center gap-[10px] rounded-[10px] border border-gray-200 bg-gray-50 p-[10px]">
      <Thumbnail type={file.type} extension={file.extension} url={file.url} />
      <div className="flex flex-col text-left">
        <p className="text-[16px] leading-[1.2] mb-[4px] line-clamp-1">
          {file.name}
        </p>
        <FormattedDateTime
          date={file.$createdAt}
          className="text-[14px] leading-[1] font-medium"
        />
      </div>
    </div>
  );
};

//
export const FileDetails = (props: FileDetailsProps) => {
  const { file } = props;

  const DetailRow = (props: { label: string; value: string }) => {
    const { label, value } = props;

    return (
      <div className="flex">
        <p className="w-[30%] text-[14px] leading-[1] text-gray-600 text-left">
          {label}
        </p>
        <p className="text-[14px] leading-[1] flex-1 text-left line-clamp-1">
          {value}
        </p>
      </div>
    );
  };

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-[10px] px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owner.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};
export const ShareInput = (props: ShareInputProps) => {
  const { file, onInputChange, onRemove } = props;
  const users = file.users;

  const UsersList = () => {
    return (
      <ul className="max-h-[200px] mt-[10px] bg-gray-50 border-[1px] border-gray-400 rounded-[10px] p-[10px] overflow-auto">
        {users.map((email: string) => (
          <li
            key={email}
            className="flex justify-between items-center gap-[10px] px-[10px] py-[5px] transition-all hover:scale-[102%]"
          >
            <p className="subtitle-2">{email}</p>
            <button
              onClick={() => onRemove(email)}
              className="btn btn-circle size-[30px] bg-transparent border-0"
            >
              <Image
                src="/assets/icons/remove.svg"
                alt="Remove"
                width={24}
                height={24}
                className="size-[25px]"
              />
            </button>
          </li>
        ))}
      </ul>
    );
  };
  const Users = () => {
    const userLength = file.users.length;
    const totalUsers =
      userLength > 1 ? `${userLength} users` : `${userLength} user`;

    if (userLength <= 0) {
      return null;
    }

    return (
      <div className="ml-[6px] mt-[20px]">
        <div className="flex justify-between">
          <p className="subtitle-2 text-light-100">Shared with</p>
          <p className="subtitle-2 text-light-200">{totalUsers}</p>
        </div>
        <UsersList />
      </div>
    );
  };

  return (
    <>
      <ImageThumbnail file={file} />
      <hr className="border-gray-200 my-[10px]" />

      <div className="space-y-[10px]">
        <p className="text-[16px] pl-[2px] text-light-100">
          Share file with others
        </p>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter email address"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="w-full h-[50px] text-[16px] rounded-[10px] px-[10px] shadow-sm"
        />
        <Users />
      </div>
    </>
  );
};
