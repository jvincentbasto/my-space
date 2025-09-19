import Image from "next/image";

import Search from "@/components/forms/Search";
import FileUploader from "@/components/forms/FileUploader";

import { logout } from "@/lib/actions/user.actions";

interface HeaderProps {
  userId: string;
  accountId: string;
}

const Header = (props: HeaderProps) => {
  const { userId, accountId } = props;

  const Form = () => {
    return (
      <form
        action={async () => {
          "use server";
          await logout();
        }}
      >
        <button
          type="submit"
          className="btn btn-neutral h-[52px] min-w-[54px] flex-center rounded-[10px]"
        >
          <Image
            src="/assets/icons/logout.svg"
            alt="logo"
            width={24}
            height={24}
            className="w-[20px] invert-0 opacity-100"
          />
        </button>
      </form>
    );
  };

  return (
    <header className="hidden items-center justify-between sm:flex gap-[20px] xl:gap-[40px] p-[20px] lg:py-[30px]">
      <Search />
      <div className="min-w-fit flex items-center gap-[10px]">
        <FileUploader ownerId={userId} accountId={accountId} />
        <Form />
      </div>
    </header>
  );
};
export default Header;
