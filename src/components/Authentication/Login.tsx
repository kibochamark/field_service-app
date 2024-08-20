"use client";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { signIn } from "next-auth/react";
import { Bounce, toast } from "react-toastify";

const Login = () => {
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      return res;
    },
    onSuccess() {
      toast.success("Login Operation Successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
    onError: () => {
      toast.error("Error, try again!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: any = new FormData(event.currentTarget);
    mutation.mutate(formData);
  };

  const handleGoogleSignIn = async () => {
    await signIn("google");
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 min-h-screen">
        <div className="bg-primary50 flex flex-col items-center justify-center p-8">
          <span>Field Service Inc</span>
          <p className="mt-4 max-w-md text-center text-lg">
            Welcome back! Sign in to your account to access our powerful tools
            and features.
          </p>
        </div>

        <div className="flex items-center justify-center w-full p-8 col-span-2">
          <div className="w-full max-w-lg">
            <form onSubmit={handleSubmit}>
              <div className="w-full max-w-lg space-y-4">
                <div className="text-center">
                  <h1 className="text-headlineLarge font-bold">
                    Login to your account
                  </h1>
                  <p className="text-titleSmall">Log in</p>
                </div>
                <div className="md:grid md:grid-cols-2 gap-6">
                  <div className="">
                    <div className="flex md:flex-row gap-2 content-center">
                      <label
                        htmlFor=""
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Company Identifier
                      </label>
                    </div>
                    <input
                      type="text"
                      id="company-identifier"
                      name="identifier"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                    />
                  </div>
                  <div className="">
                    <div className="flex md:flex-row gap-2 content-center">
                      <label
                        htmlFor=""
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email Address
                      </label>
                    </div>
                    <input
                      type="email"
                      id="email-address"
                      name="email"
                      required
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                    />
                  </div>
                </div>
                <div>
                  <div className="flex md:flex-row gap-2 content-center">
                    <label
                      htmlFor=""
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                  />
                </div>
                <div>
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    name="finalized"
                    className=" text-primary bg-gray-100 border-gray-300 rounded focus:ring-purple-600 dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 disabled:text-gray-400">
                    Remember Me
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-primary600 hover:bg-primary800 rounded-md w-full py-3 shadow-md text-white text-bodyMedium font-semibold"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <span className="loading loading-spinner loading-lg"></span>
                    ) : (
                      <div>Login</div>
                    )}
                  </button>
                </div>

                <div className="text-center">or</div>

                <div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="bg-white w-full hover:bg-primary50 border border-purple-600 py-3 shadow-md text-bodyMedium font-semibold text-primary600 rounded-md"
                  >
                    Continue with Google
                  </button>
                </div>

                <div className="text-center text-bodyMedium">
                  <Link href={"/signup"}>
                    Dont have an account?{" "}
                    <span className="text-primary600 font-semibold">
                      Sign up
                    </span>{" "}
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
