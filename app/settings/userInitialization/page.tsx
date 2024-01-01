"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type InitializationFormInput = {
  username: string;
  password: string;
  confirmPassword: string;
};

type InitializationErrors = {
  invalidUsername?: string | null;
  usernameTaken?: string | null;
  invalidPassword?: string | null;
  passwordMismatch?: string | null;
};

//styles
const inputBoxStyle =
  "h-6 py-6 px-3 rounded-md bg-lightGrey focus:outline-none focus:ring-purple focus:ring-2 text-black";

const page = () => {
  const [backendErrors, setBackendErrors] = useState<InitializationErrors>({});

  const { data: session } = useSession();

  function initializeUser(data: any) {
    setBackendErrors({});
    axios
      .patch("/api/prisma/profile/userInitialization", data)
      .then((res) => {
        alert("Success!");
      })
      .catch((err) => {
        console.log(err);
        setBackendErrors(err.response.data);
      });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<InitializationFormInput>();
  return (
    <div className="w-1/2 h-[95vh] my-4 relative flex flex-col bg-boxDarkGrey p-4">
      <form
        onSubmit={handleSubmit(initializeUser)}
        className="flex flex-col gap-4"
      >
        {/* username */}
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            defaultValue={session?.user.username}
            className={inputBoxStyle}
            {...register("username", { required: true })}
          />
        </div>
        {backendErrors.usernameTaken && (
          <span className=" text-sm mt-1 text-purple">
            This username is already taken
          </span>
        )}

        {/* password */}
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className={inputBoxStyle}
            {...register("password", {})}
          />
        </div>

        {/* confirm password */}
        <div className="flex flex-col">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm password"
            className={inputBoxStyle}
            {...register("confirmPassword", {
              validate: (val: string) => {
                if (watch("password") != val) {
                  return "Your passwords don't match";
                }
              },
            })}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-purple outline outline-1 outline-white rounded-md"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default page;
