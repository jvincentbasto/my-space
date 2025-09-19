"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import OtpModal from "@/components/forms/OTPModal";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signup } from "@/lib/actions/user.actions";

interface SignupFormProps {}

const SignUpForm = (props: SignupFormProps) => {
  const {} = props;

  const [accountId, setAccountId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formSchema = z.object({
    email: z.string().email(),
    fullName: z.string().min(2).max(50),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const user = await signup({
        fullName: values.fullName || "",
        email: values.email,
      });

      setAccountId(user.accountId);
    } catch {
      setErrorMessage("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  //
  const SignUp = () => {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-[580px] max-h-[800px] lg:h-full flex flex-col justify-center space-y-[20px]"
        >
          <h1 className="text-[30px] font-bold text-gray-600">Sign Up</h1>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <div className="h-[70px] flex justify-center flex-col rounded-[10px] px-[20px] shadow-md">
                  <FormLabel
                    htmlFor="fullName"
                    className="w-full text-[14px] text-gray-600 pt-[10px]"
                  >
                    Full Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      className="text-[14px] border-none shadow-none p-0 focus-visible:ring-transparent placeholder:text-gray-400"
                      id="fullName"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage className="text-[14px] text-error ml-[20px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="-[70px] flex justify-center flex-col rounded-[10px] px-[20px] shadow-md">
                  <FormLabel htmlFor="email" className="shad-form-label">
                    Email
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="text-[14px] border-none shadow-none p-0 focus-visible:ring-transparent placeholder:text-gray-400"
                      id="email"
                      autoComplete="true"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage className="text-[14px] text-error ml-[20px]" />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="btn btn-primary h-[60px] rounded-[5px] mt-[10px]"
            disabled={isLoading}
          >
            Sign Up
            {isLoading ? (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            ) : null}
          </button>

          {errorMessage ? (
            <p className="w-fit text-[14px] text-center text-error mx-auto rounded-[10px] bg-error/5 px-[30px] py-[20px]">
              *{errorMessage}
            </p>
          ) : null}

          <div className="text-[14px] flex justify-center">
            <p className="text-light-100">Already have an account?</p>
            <Link
              href={"/login"}
              className="ml-[2px] btn-link font-medium text-primary"
            >
              {" "}
              Login
            </Link>
          </div>
        </form>
      </Form>
    );
  };

  return (
    <>
      <SignUp />
      {accountId ? (
        <OtpModal email={form.getValues("email")} accountId={accountId} />
      ) : null}
    </>
  );
};
export default SignUpForm;
