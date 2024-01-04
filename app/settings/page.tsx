"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type CredentialsChangeInput = {
  username: string;
  password: string;
  confirmPassword: string;
};

type CredentialsErrors = {
  invalidUsername?: string | null;
  usernameTaken?: string | null;
  invalidPassword?: string | null;
  passwordMismatch?: string | null;
};

//styles
const inputBoxStyle =
  "h-6 py-6 px-3 rounded-md bg-lightGrey focus:outline-none focus:ring-purple focus:ring-2 text-black";

const page = () => {
  const [backendErrors, setBackendErrors] = useState<CredentialsErrors>({});
  const [saveStatus, setSaveStatus] = useState<"Save" | "Saving..." | "Saved!">(
    "Save"
  );

  const savedPopup = async () => {};

  const { data: session } = useSession();

  function saveDetails(data: any) {
    setBackendErrors({});
    setSaveStatus("Saving...");
    axios
      .patch("/api/prisma/profile/userInitialization", data)
      .then((res) => {
        setSaveStatus("Saved!");

        setTimeout(() => {
          setSaveStatus("Save");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setSaveStatus("Save");
        setBackendErrors(err.response.data);
      });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CredentialsChangeInput>();
  return (
    <div className="w-1/3 flex flex-col h-[100vh] text-3xl justify-start my-4">
      <h2 className="font-base">Account details</h2>
      <hr />
      <div className="w-full h-min relative flex flex-col text-base font-light my-2">
        <form
          onSubmit={handleSubmit(saveDetails)}
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
          {errors.confirmPassword && (
            <span className=" text-sm mt-1 text-purple">
              Passwords must match
            </span>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-purple outline outline-1 outline-white rounded-md focus:bg-lightGrey focus:outline-purple focus:text-purple"
          >
            {saveStatus}
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
