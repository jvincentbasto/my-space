import Sort from "@/components/forms/Sort";
import Card from "@/components/cards/Card";

import { getFileTypesParams } from "@/lib/utils";
import { FileType, getFiles } from "@/lib/actions/file.actions";

interface CategoryPageProps {
  params?: Promise<any>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const CategoryPage = async (props: CategoryPageProps) => {
  // const { params, searchParams } = props

  const params = await props.params;
  const searchParams = await props.searchParams;

  const type = (params?.type as string) || "";
  const searchText = (searchParams?.query as string) || "";
  const sort = (searchParams?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];
  const files = await getFiles({ types, searchText, sort });

  const Files = () => {
    if (files.total <= 0) {
      return (
        <div className="w-full h-[200px] flex justify-center items-center bg-white rounded-[10px]">
          <p className="text-[20px] font-bold text-center text-gray-400">
            No Results
          </p>
        </div>
      );
    }

    // const currentFiles = files.documents
    const currentFiles = files.rows;

    return (
      <section className="grid w-full gap-[20px] max-sm:gap-[10px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentFiles.map((file: Record<string, any>) => (
          <Card key={file.$id} file={file} />
        ))}
      </section>
    );
  };

  return (
    <div className="w-full max-w-[1200px] flex flex-col items-center gap-[30px] mx-auto">
      <section className="w-full">
        <h1 className="text-[30px] font-bold capitalize">{type}</h1>
        <div className="flex flex-col justify-between sm:flex-row sm:items-center mt-[10px]">
          <p className="text-[16px]">
            <span className="font-semibold">Total Size:</span>{" "}
            <span className="font-medium text-gray-600">0 MB</span>
          </p>

          <div className="flex items-center mt-[20px] sm:mt-0 sm:gap-[10px]">
            <p className="w-full text-[16px] font-semibold text-gray-600 hidden sm:block">
              Sort by:
            </p>
            <Sort />
          </div>
        </div>
      </section>

      <Files />
    </div>
  );
};
export default CategoryPage;
