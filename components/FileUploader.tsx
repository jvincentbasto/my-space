"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import Thumbnail from "@/components/cards/Thumbnail";

import { MAX_FILE_SIZE } from "@/constants";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import { uploadFile } from "@/lib/actions/file.actions";
import { useToast } from "@/hooks/use-toast";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = (props: Props) => {
  const { ownerId, accountId, className } = props;

  const path = usePathname();
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);

  // dropzone
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );

          return toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> is too large.
                Max file size is 50MB.
              </p>
            ),
            className: "bg-red rounded-[10px]!",
          });
        }

        return uploadFile({ file, ownerId, accountId, path }).then(
          (uploadedFile) => {
            if (uploadedFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name)
              );
            }
          }
        );
      });

      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // handlers
  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const Uploads = () => {
    if (files.length <= 0) return null;

    return (
      <ul className="fixed bottom-10 right-10 z-50 flex size-full h-fit max-w-[480px] flex-col gap-3 rounded-[20px] bg-white p-7 shadow-drop-3">
        <h4 className="h4 text-light-100">Uploading</h4>

        {files.map((file, index) => {
          const { type, extension } = getFileType(file.name);

          return (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between  gap-3 rounded-xl p-3 shadow-drop-3"
            >
              <div className="flex items-center gap-3">
                <Thumbnail
                  type={type}
                  extension={extension}
                  url={convertFileToUrl(file)}
                />

                <div className="subtitle-2 mb-2 line-clamp-1 max-w-[300px]">
                  {file.name}
                  <Image
                    src="/assets/icons/file-loader.gif"
                    width={80}
                    height={26}
                    alt="Loader"
                  />
                </div>
              </div>

              <Image
                src="/assets/icons/remove.svg"
                width={24}
                height={24}
                alt="Remove"
                onClick={(e) => handleRemoveFile(e, file.name)}
              />
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <button
        type="button"
        className={cn(
          "btn btn-primary h-[52px] gap-[10px] px-[40px] rounded-[10px] shadow-md",
          className
        )}
      >
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
          className="size-[24px]"
        />{" "}
        <p className="text-[16px] font-bold">Upload</p>
      </button>
      <Uploads />
    </div>
  );
};

export default FileUploader;
