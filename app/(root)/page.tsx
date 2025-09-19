import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";

import ActionDropdown from "@/components/forms/ActionDropdown";
import { Chart } from "@/components/Chart";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { Thumbnail } from "@/components/cards/Thumbnail";
import { Separator } from "@/components/ui/separator";

import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";

interface DashboardProps {}

const Dashboard = async ({}: DashboardProps) => {
  // Parallel requests
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);

  const Categories = () => {
    const Card = ({ summary }: { summary: Partial<Record<string, any>> }) => {
      return (
        <Link
          href={summary.url}
          className="rounded-[10px] bg-white p-5 transition-all hover:scale-[103%]"
        >
          <div className="">
            {/* <Image
                  src={summary.icon}
                  width={100}
                  height={100}
                  alt="uploaded image"
                  className="w-[200px] object-contain absolute top-[-25px] left-[-12px] z-10"
                /> */}

            <p className="text-[18px] font-semibold">{summary.title}</p>
            <p className="text-[14px] font-semibold text-gray-400">
              {convertFileSize(summary.size) || 0}
            </p>
            <Separator className="bg-light-400 my-[10px]" />
            <FormattedDateTime
              date={summary.latestDate}
              className="text-[14px]"
            />
          </div>
        </Link>
      );
    };

    return (
      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-[20px] mt-[20px] text-[16px]">
        {usageSummary.map((summary) => {
          return <Card key={summary.title} summary={summary} />;
        })}
      </ul>
    );
  };
  const RecentUploads = () => {
    const Card = ({ file }: { file: Partial<Record<string, any>> }) => {
      return (
        <div className="flex gap-[10px]">
          <Link
            href={file.url}
            target="_blank"
            className="w-full flex items-center gap-[10px] transition-all hover:scale-[102%]"
          >
            <Thumbnail
              type={file.type}
              extension={file.extension}
              url={file.url}
            />
            <div className="w-full flex flex-col gap-[4px]">
              <p className="text-[16px] leading-[1.2] font-medium text-gray-800 line-clamp-1 w-full">
                {file.name}
              </p>
              <FormattedDateTime
                date={file.$createdAt}
                className="text-[12px] leading-[1] font-semibold"
              />
            </div>
          </Link>

          <div className="min-w-[50px] flex justify-end">
            <ActionDropdown file={file} />
          </div>
        </div>
      );
    };

    return (
      <div className="h-full rounded-[10px] bg-white p-[20px]">
        <h2 className="text-[24px] font-bold text-gray-800 mb-[30px]">
          Recent uploaded files
        </h2>
        {files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.documents.map((file: Partial<Record<string, any>>) => {
              return <Card key={file.$id} file={file} />;
            })}
          </ul>
        ) : (
          <div className="w-full h-[80%] min-h-[100px] flex items-center mt-10">
            <p className="w-full text-center text-[24px] font-bold text-gray-300">
              No files uploaded
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[1200px] grid grid-cols-1 gap-[20px] ">
      <section>
        <Chart used={totalSpace.used} />
        <Categories />
      </section>
      <section>
        <RecentUploads />
      </section>
    </div>
  );
};
export default Dashboard;
