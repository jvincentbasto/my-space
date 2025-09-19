"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";

import { navItems } from "@/constants";
import FileUploader from "@/components/forms/FileUploader";

import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/user.actions";

interface MobileNavigationProps {
  $id: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

const MobileNavigation = (props: MobileNavigationProps) => {
  const { $id: ownerId, accountId, fullName, avatar, email } = props;

  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Logo = () => {
    return (
      <Link href="/" className="text-center">
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
  const Profile = (props: Record<string, any>) => {
    return (
      <div className="flex items-center gap-[10px] rounded-[10px] mt-[20px] p-[10px] bg-blue-100  max-lg:bg-transparent text-gray-800">
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
        <div className="min-w-0 flex flex-col line-clamp-1">
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
  const NavBtn = () => {
    return (
      <div className="btn btn-circle size-[35px] p-[5px] bg-transparent border-transparent border-2 hover:bg-gray-100">
        <Image
          src="/assets/icons/menu.svg"
          alt="Search"
          width={30}
          height={30}
          className="size-full object-cover"
        />
      </div>
    );
  };
  const Navs = () => {
    const NavItem = (props: { item: Record<string, any> }) => {
      const { name, url, icon } = props.item;

      return (
        <Link key={name} href={url} className="w-full">
          <li
            className={cn(
              "w-full h-[52px] flex text-gray-500 gap-[10px] justify-start items-center lg:px-[30px] rounded-[10px] px-[10px]",
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
            <p className="block">{name}</p>
          </li>
        </Link>
      );
    };

    return (
      <nav className="flex-1 gap-[10px] ">
        <ul className="flex flex-1 flex-col gap-[10px]">
          {navItems.map((item) => {
            return <NavItem key={item.name} item={item} />;
          })}
        </ul>
      </nav>
    );
  };
  const Actions = (props: Record<string, any>) => {
    return (
      <div className="flex flex-col justify-between gap-[20px]">
        <FileUploader ownerId={ownerId} accountId={accountId} />
        <button
          type="submit"
          className="btn btn-outline btn-neutral h-[52px] flex items-center gap-[10px] rounded-[10px] shadow-none"
          onClick={async () => await logout()}
        >
          <Image
            src="/assets/icons/logout.svg"
            alt="logo"
            width={24}
            height={24}
          />
          <p className="text-[16px]">Logout</p>
        </button>
      </div>
    );
  };

  return (
    <header className="h-[70px] flex justify-between items-center px-[20px] pt-[8px] sm:hidden shadow-md sticky top-0 left-0">
      <Logo />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <NavBtn />
        </SheetTrigger>
        <SheetContent className="h-screen px-[10px] flex flex-col gap-[20px] bg-white shadow-md">
          <SheetTitle>
            <Profile />
            <hr className="mt-[20px] border-gray-200" />
          </SheetTitle>
          <Navs />
          <Actions />
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
