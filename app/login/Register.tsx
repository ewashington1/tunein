"use client";

import React, { useState, useEffect, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { User } from "@/app/api/prisma/auth/register/route";
import axios from "axios";
import variables from "../variables.module.scss";
import { useRouter } from "next/navigation";
import { FormContext } from "./page";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

//types associated with useState -> https://www.carlrippon.com/typed-usestate-with-typescript/
//hook form with ts: https://react-hook-form.com/get-started

interface RegistrationInputs extends User {
  confirmPassword: string;
}

type RegisterProps = {
  className?: string;
};

const Register = ({ className }: RegisterProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegistrationInputs>();

  const [backendErrors, setBackendErrors] = useState<{
    email?: string;
    username?: string;
  }>({});

  const router = useRouter();

  const { data: session } = useSession();

  //automatically takes user home if they're logged in
  useEffect(() => {
    if (session) {
      router.push("/home");
    }
  }, [session]);

  const createUser: SubmitHandler<RegistrationInputs> = async (data) => {
    setBackendErrors({});
    axios
      .post("/api/prisma/auth/register", data)
      .then(async (res) => {
        console.log(res);
        const cred = await signIn("credentials", {
          // callbackUrl: "/home",
          username: res.data.user.username,
          id: res.data.user.id,
          email: res.data.user.email,
          name: res.data.user.name,
          redirect: false,
        });
      })
      .catch((err) => {
        //username error is present
        if (err.response.data.errors.username) {
          setBackendErrors({ username: "Username is already taken." });
        }
        //email error is present
        else if (err.response.data.errors.email) {
          setBackendErrors({ email: "Email is already taken." });
        }
      });
  };

  const setFormState = useContext(FormContext);

  return (
    <form
      onSubmit={handleSubmit(createUser)}
      className={
        `text-black flex flex-col gap-8 p-6 w-[25%] h-min mr-56 rounded-md ` +
        className
      }
      style={{
        backgroundColor: variables.boxDarkGrey,
        filter: "drop-shadow(-10px 10px 1px rgba(0, 0, 0, 0.25))",
      }}
    >
      <div className="flex flex-col">
        <label htmlFor="name" className="text-white mb-1">
          Full Name
        </label>
        <input
          className="h-6 py-6 px-3 rounded-md"
          id="name"
          placeholder="Full Name"
          style={{ backgroundColor: variables.lightGrey }}
          {...register("name", { required: true })}
        />
        {errors.name && (
          <span className=" text-sm mt-1 text-purple">
            This field is required.
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="username" className="text-white mb-1">
          Username
        </label>
        <input
          className="h-6 py-6 px-3 rounded-md"
          id="username"
          placeholder="Username"
          style={{ backgroundColor: variables.lightGrey }}
          {...register("username", { required: true })}
        />
        {errors.username && (
          <span className=" text-sm mt-1 text-purple">
            This field is required.
          </span>
        )}
        {backendErrors.username && (
          <span className=" text-sm mt-1 text-purple">
            {backendErrors.username}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="email" className="text-white mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="Email"
          className="h-6 py-6 px-3 rounded-md"
          id="email"
          style={{ backgroundColor: variables.lightGrey }}
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className=" text-sm mt-1 text-purple">
            This field is required.
          </span>
        )}
        {backendErrors.email && (
          <span className=" text-sm mt-1 text-purple">
            {backendErrors.email}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="password" className="text-white mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          className="h-6 py-6 px-3 rounded-md"
          id="password"
          style={{ backgroundColor: variables.lightGrey }}
          {...register("password", { required: true })}
        />
        {errors.password && (
          <span className=" text-sm mt-1 text-purple">
            This field is required.
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="confirmPassword" className="text-white mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Confirm Password"
          className="h-6 py-6 px-3 rounded-md"
          id="confirmPassword"
          style={{ backgroundColor: variables.lightGrey }}
          {...register("confirmPassword", {
            required: true,
            validate: (val: string) => {
              if (watch("password") != val) {
                return "Your passwords don't match";
              }
            },
          })}
        />
        {errors.confirmPassword && (
          <span className=" text-sm mt-1 text-purple">
            Passwords must match.
          </span>
        )}
      </div>
      <input
        type="submit"
        value="Sign Up"
        className="text-white self-end rounded-md px-3 py-2 w-min cursor-pointer"
        style={{ backgroundColor: variables.purple }}
      />
      <div className=" self-center">
        <span className="text-white">Already have an account? </span>
        <button
          className="text-purple underline"
          onClick={() => setFormState("sign in")}
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default Register;
