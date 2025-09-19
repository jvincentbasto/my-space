"use client";

import SignInForm from "./SigninForm";
import SignUpForm from "./SignupForm";

type FormType = "login" | "signup";
interface AuthFormProps {
  type: FormType;
}

const AuthForm = (props: AuthFormProps) => {
  const { type } = props;

  return (
    <>
      {type === "signup" ? <SignUpForm /> : null}
      {type === "login" ? <SignInForm /> : null}
    </>
  );
};

export default AuthForm;
