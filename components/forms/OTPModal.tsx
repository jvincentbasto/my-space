"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { verifySecret, sendEmailOTP } from "@/lib/actions/user.actions";

interface OtpModalProps {
  accountId: string;
  email: string;
}

const OtpModal = (props: OtpModalProps) => {
  const { accountId, email } = props;

  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sessionId = await verifySecret({ accountId, otp });

      if (sessionId) router.push("/");
    } catch (error) {
      // console.log("Failed to verify OTP", error);
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    await sendEmailOTP({ email });
  };

  const Header = () => {
    return (
      <AlertDialogHeader className="flex justify-center relative">
        <AlertDialogTitle className="text-[18px] font-bold text-center">
          Enter Your OTP
          <Image
            src="/assets/icons/close-dark.svg"
            alt="close"
            width={20}
            height={20}
            onClick={() => setIsOpen(false)}
            className="cursor-pointer absolute top-[-10px] right-[-10px]"
          />
        </AlertDialogTitle>
        <AlertDialogDescription className="text-[14px] text-center text-gray-600">
          We&apos;ve sent a code to{" "}
          <span className="pl-[4px] text-primary">{email}</span>
        </AlertDialogDescription>
      </AlertDialogHeader>
    );
  };
  const Footer = () => {
    return (
      <AlertDialogFooter>
        <div className="flex w-full flex-col gap-[10px]">
          <AlertDialogAction
            onClick={handleSubmit}
            className="h-[50px] btn btn-primary rounded-[5px]"
            type="button"
          >
            Submit
            {isLoading ? (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-[10px] animate-spin"
              />
            ) : null}
          </AlertDialogAction>

          <div className="text-[14px] text-center text-gray-600 mt-[5px]">
            Didn&apos;t get a code?
            <button
              type="button"
              className="btn btn-link pl-[4px] text-primary"
              onClick={handleResendOtp}
            >
              Click to resend
            </button>
          </div>
        </div>
      </AlertDialogFooter>
    );
  };

  const input =
    "size-[50px] md:size-[60px] flex justify-center gap-[10px] text-[20px] md:text-[40px] font-medium rounded-[10px] border-[2px] border-gray-600 shadow-md ";

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-fit max-w-[550] space-y-[10px] rounded-[10px] md:rounded-[20px] p-[40px] bg-white outline-hidden">
        <Header />
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup className="w-full flex justify-between gap-[10px]">
            <InputOTPSlot index={0} id="0" className={`${input}`} />
            <InputOTPSlot index={1} id="1" className={`${input}`} />
            <InputOTPSlot index={2} id="2" className={`${input}`} />
            <InputOTPSlot index={3} id="3" className={`${input}`} />
            <InputOTPSlot index={4} id="4" className={`${input}`} />
            <InputOTPSlot index={5} id="5" className={`${input}`} />
          </InputOTPGroup>
        </InputOTP>{" "}
        <Footer />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;
