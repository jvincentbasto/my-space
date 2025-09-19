import Link from "next/link";

import { Separator } from "@/components/ui/separator";

import Search from "@/components/forms/Search";
import { Chart } from "@/components/charts/Chart";
import ActionDropdown from "@/components/forms/ActionDropdown";
import { FormattedDateTime } from "@/components/cards/FormattedDateTime";
import { Thumbnail } from "@/components/cards/Thumbnail";

import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { getUsageSummary } from "@/lib/utils";
import { fileUtils } from "@/lib/fileUtils";

const { convertFileSize } = fileUtils;

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
          className="rounded-[10px] bg-white p-[20px] transition-all max-sm:hover:scale-[101%] hover:scale-[103%]"
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
            <hr className="border-gray-200 my-[10px]" />
            <FormattedDateTime
              date={summary.latestDate}
              className="text-[14px]"
            />
          </div>
        </Link>
      );
    };

    return (
      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-[20px] max-sm:gap-[10px] mt-[20px] max-sm:mt-[10px] text-[16px]">
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
            className="w-full flex items-center gap-[10px] transition-all max-sm:hover:scale-[101%] hover:scale-[102%]"
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

    // const currentFiles = files.documents
    const currentFiles = files.rows;

    return (
      <div className="h-full rounded-[10px] bg-white p-[20px]">
        <h2 className="text-[24px] font-bold text-gray-800 mb-[30px]">
          Recent uploaded files
        </h2>
        {currentFiles.length > 0 ? (
          <ul className="mt-[20px] max-sm:mt-[10px] flex flex-col gap-[20px]">
            {currentFiles.map((file: Partial<Record<string, any>>) => {
              return <Card key={file.$id} file={file} />;
            })}
          </ul>
        ) : (
          <div className="w-full h-[80%] min-h-[200px] flex items-center mt-[20px] max-sm:mt-[10px]">
            <p className="w-full text-center text-[24px] font-bold text-gray-300">
              No files uploaded
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[1200px] grid grid-cols-1 gap-[20px] max-sm:gap-[10px]">
      <section>
        <div className="w-full hidden max-sm:block mb-[20px] max-sm:mb-[10px]">
          <Search />
        </div>
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
