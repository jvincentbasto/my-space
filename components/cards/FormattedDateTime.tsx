import { cn, formatDateTime } from "@/lib/utils";

interface FormattedDateTimeProps {
  date: string;
  className?: string;
}

export const FormattedDateTime = (props: FormattedDateTimeProps) => {
  const { date, className } = props;

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
