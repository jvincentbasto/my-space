import React from "react";
import { cn, formatDateTime } from "@/lib/utils";

export const FormattedDateTime = ({
  date,
  className,
}: {
  date: string;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-[14px] font-semibold leading-[1] text-gray-400",
        className
      )}
    >
      {formatDateTime(date)}
    </p>
  );
};
export default FormattedDateTime;
