"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { navItems } from "@/constants";
import { cn } from "@/lib/utils";

interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

const Sidebar = (props: SidebarProps) => {
  const { fullName, avatar, email } = props;

  const pathname = usePathname();

  const Logo = () => {
    return (
      <Link href="/" className="text-left ml-[5px]">
        <p className="text-[30px] block max-lg:hidden font-bold text-neutral-700">
          <span className="">My</span>
          <span className="inline-block text-primary">Space</span>
          <span className="inline-block size-[10px] bg-primary rounded-full"></span>
        </p>
        <p className="text-[30px] hidden max-lg:block font-bold text-neutral-700">
          <span className="">M</span>
          <span className="inline-block text-primary">S</span>
          <span className="inline-block size-[8px] bg-primary rounded-full"></span>
        </p>
      </Link>
    );
  };
  const Navs = () => {
    const NavItem = (props: { item: Record<string, any> }) => {
      const { name, url, icon } = props.item;

      return (
        <Link key={name} href={url} className="w-full">
          <li
            className={cn(
              "w-full h-[52px] flex text-gray-500 gap-[10px] justify-center lg:justify-start items-center lg:px-[30px] rounded-[10px] px-[10px]",
              pathname === url ? "" : "hover:bg-blue-50",
              pathname === url ? "bg-primary text-white shadow-lg" : ""
            )}
          >
            <Image
              src={icon}
              alt={name}
              width={24}
              height={24}
              className={cn(
                "w-[22px] invert opacity-25",
                pathname === url ? "invert-0 opacity-100" : ""
              )}
            />
            <p className="hidden lg:block">{name}</p>
          </li>
        </Link>
      );
    };

    return (
      <nav className="flex-1 gap-[10px] mt-[36px] max-lg:mt-[20px]">
        <ul className="flex flex-1 flex-col gap-[10px]">
          {navItems.map((item) => {
            return <NavItem key={item.name} item={item} />;
          })}
        </ul>
      </nav>
    );
  };
  const Profile = (props: Record<string, any>) => {
    return (
      <div className="flex justify-center items-center lg:justify-start gap-[10px] rounded-[10px] mt-[10px] p-[10px] bg-blue-100  max-lg:bg-transparent text-gray-800">
        <div className="size-[50px] min-w-[50px] border-[1px] border-gray-400 rounded-full p-[4px] hover:border-primary cursor-pointer">
          <Image
            // src={avatar}
            src={"/assets/images/avatar.png"}
            alt="Avatar"
            width={44}
            height={44}
            className=" aspect-square size-full rounded-full object-cover"
          />
        </div>
        <div className="min-w-0 hidden lg:flex flex-col line-clamp-1">
          <p className="min-w-0 text-[16px] font-semibold capitalize">
            {fullName}
          </p>
          <p className="min-w-0 text-[12px] font-medium text-gray-600">
            {email}
          </p>
        </div>
      </div>
    );
  };

  return (
    <aside className="remove-scrollbar hidden h-screen w-[80px] lg:w-[250px] xl:w-[300px] sm:flex flex-col overflow-auto px-[10px] py-[30px] shadow-lg">
      <Logo />
      <Navs />
      <Profile />
    </aside>
  );
};
export default Sidebar;
