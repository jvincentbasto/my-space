"use client";

import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { styleUtils } from "@/lib/styleUtils";

const { getFileIcon } = styleUtils;

interface ThumbnailProps {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}

export const Thumbnail = (props: ThumbnailProps) => {
  const { type, extension, url = "", imageClassName, className } = props;
  const isImage = type === "image" && extension !== "svg";

  function FilePreview({ url, type }: { url: string; type: string }) {
    if (type.startsWith("image")) {
      return (
        <Image src={url} alt="file" width={200} height={200} unoptimized />
      );
    }

    if (type.startsWith("video")) {
      const videoRef = useRef<HTMLVideoElement>(null);

      const skip = (seconds: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime += seconds;
        }
      };

      return (
        <>
          <video src={url} controls width={400} height={300} ref={videoRef} />
          <div className="flex gap-2 mt-2">
            <button onClick={() => skip(-10)}>⏪ Back 10s</button>
            <button onClick={() => skip(10)}>⏩ Forward 10s</button>
          </div>
        </>
      );
    }

    if (type.startsWith("audio")) {
      return <audio src={url} controls />;
    }

    if (type === "pdf" || type === "document") {
      return <iframe src={url} width="600" height="400"></iframe>;
    }

    return null;
    // return (
    //   <a href={url} target="_blank" rel="noopener noreferrer">
    //     Open file
    //   </a>
    // );
  }

  return (
    <>
      {/* <FilePreview url={url} type={type} /> */}
      <figure
        className={cn(
          "flex justify-center items-center size-[50px] min-w-[50px] overflow-hidden rounded-full bg-blue-100",
          className
        )}
      >
        <Image
          src={isImage ? url : getFileIcon(extension, type)}
          alt="thumbnail"
          width={100}
          height={100}
          className={cn(
            "size-[30px] object-contain",
            imageClassName,
            isImage ? "size-full object-cover object-center" : ""
          )}
        />
      </figure>
    </>
  );
};
export default Thumbnail;
