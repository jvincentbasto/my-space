"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import {
  FileDetails,
  ShareInput,
} from "@/components/modals/ActionsModalContent";

import { actionsDropdownItems } from "@/constants";
import { appwriteUtils } from "@/lib/appwriteUtils";
import { deleteFile, renameFile, updateFile } from "@/lib/actions/file.actions";

const { constructDownloadUrl } = appwriteUtils;

interface ActionDropdownProps {
  file: Partial<Record<string, any>>;
}
type ActionType = {
  label: string;
  icon: string;
  value: string;
};

const ActionDropdown = ({ file }: ActionDropdownProps) => {
  const path = usePathname();

  const [name, setName] = useState(file.name);
  const [emails, setEmails] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);

  // handlers
  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);

    setName(file.name);
    //   setEmails([]);
  };
  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => updateFile({ fileId: file.$id, emails, path }),
      delete: () =>
        deleteFile({ fileId: file.$id, bucketField: file.bucketField, path }),
    };

    success = await actions[action.value as keyof typeof actions]();
    if (success) closeAllModals();

    setIsLoading(false);
  };
  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);

    const success = await updateFile({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });

    if (success) setEmails(updatedEmails);
    closeAllModals();
  };

  // components
  const DropdownBtn = () => {
    return (
      <DropdownMenuTrigger className="btn btn-circle size-[30px] bg-transparent border-0 hover:bg-gray-100 focus:bg-gray-100">
        <Image
          src="/assets/icons/dots.svg"
          alt="dots"
          width={34}
          height={34}
          className="size-[20px] rotate-z-[90deg]"
        />
      </DropdownMenuTrigger>
    );
  };
  const DropdownAction = ({ actionItem }: { actionItem: ActionType }) => {
    const options = ["rename", "share", "delete", "details"];

    const Download = () => {
      return (
        <Link
          href={constructDownloadUrl(file.bucketField)}
          download={file.name}
          className="flex items-center gap-2"
        >
          <Image
            src={actionItem.icon}
            alt={actionItem.label}
            width={30}
            height={30}
          />
          {actionItem.label}
        </Link>
      );
    };
    const Item = () => {
      return (
        <div className="flex items-center gap-[10px] ">
          <Image
            src={actionItem.icon}
            alt={actionItem.label}
            width={30}
            height={30}
          />
          {actionItem.label}
        </div>
      );
    };

    return (
      <DropdownMenuItem
        key={actionItem.value}
        className="cursor-pointer bg-white hover:bg-gray-100 focus:bg-gray-100"
        onClick={() => {
          setAction(actionItem);

          if (options.includes(actionItem.value)) {
            setIsModalOpen(true);
          }
        }}
      >
        {actionItem.value === "download" ? <Download /> : <Item />}
      </DropdownMenuItem>
    );
  };
  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    const Options = () => {
      const options = ["rename", "delete", "share"];

      if (!options.includes(value)) return null;

      return (
        <DialogFooter className="flex flex-col gap-[10px] md:flex-row mt-[10px]">
          <button
            onClick={closeAllModals}
            className="btn btn-soft btn-neutral min-h-[40px] flex-1 rounded-[10px]"
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            className="btn btn-soft btn-primary w-full min-h-[40px] flex-1 rounded-[10px]"
          >
            <p className="capitalize">{value}</p>
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="animate-spin"
              />
            )}
          </button>
        </DialogFooter>
      );
    };

    return (
      <DialogContent className="max-w-[600px] text-[14px] bg-white">
        <DialogHeader className="flex flex-col gap-[10px]">
          <DialogTitle className="text-[20px] text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              id={name}
              name={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[40px]"
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="text-[14px] text-gray-800">
              Are you sure you want to delete{` `}
              <span className="font-medium text-brand-100">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        <Options />
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownBtn />
        <DropdownMenuContent className="min-w-[200px] max-w-[250px] bg-white p-[10px] border-0 shadow-lg ">
          <DropdownMenuLabel className="w-full truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-[10px]" />
          {actionsDropdownItems.map((actionItem) => {
            return (
              <DropdownAction key={actionItem?.label} actionItem={actionItem} />
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};
export default ActionDropdown;
