"use client";

import React, { useContext, useState, useEffect } from "react";
import variables from "../variables.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FormContext } from "./page";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

//Login.tsx

type LoginProps = {
  className?: string;
};

type LoginInputs = {
  usernameOrEmail: string;
  password: string;
};

type LoginErrors = {
  login?: string;
};

const Login = ({ className }: LoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const { data: session } = useSession();

  //automatically takes user home if they're logged in
  useEffect(() => {
    if (session) {
      router.push("/home");
    }
  }, [session]);

  const [backendErrors, setBackendErrors] = useState<LoginErrors>({});

  const login: SubmitHandler<LoginInputs> = async (data) => {
    setBackendErrors({});
    axios
      .post("/api/login", data)
      .then(async (res) => {
        const cred = await signIn("credentials", {
          // callbackUrl: "/home",
          username: res.data.body.user.username,
          id: res.data.body.user.id,
          email: res.data.body.user.email,
          name: res.data.body.user.name,
          redirect: false,
        });
      })
      .catch((err) => {
        //username error is present
        console.log(err);
        if (err.response.data.errors.login) {
          setBackendErrors(err.response.data.errors);
        }
      });
  };

  const router = useRouter();

  const setFormState = useContext(FormContext);

  return (
    <form
      onSubmit={handleSubmit(login)}
      className={
        `text-black flex flex-col gap-8 p-6 w-[25%] h-min mr-56 rounded-md bg-boxDarkGrey ` +
        className
      }
      style={{
        filter: "drop-shadow(-10px 10px 1px rgba(0, 0, 0, 0.25))",
      }}
    >
      <div className="flex flex-col">
        <label className="text-white mb-1" htmlFor="usernameOrEmail">
          Username or Email
        </label>
        <input
          className="h-6 py-6 px-3 rounded-md bg-lightGrey"
          placeholder="Username or Email"
          id="usernameOrEmail"
          type="text"
          {...register("usernameOrEmail", { required: true })}
        />
        {errors.usernameOrEmail && (
          <span className=" text-sm mt-1 text-purple">
            This field is required.
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-white mb-1" htmlFor="password">
          Password
        </label>
        <input
          className="h-6 py-6 px-3 rounded-md bg-lightGrey"
          placeholder="Password"
          type="password"
          id="password"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <span className=" text-sm mt-1 text-purple">
            This field is required.
          </span>
        )}
      </div>

      <input
        type="submit"
        value="Sign In"
        className="text-white self-end rounded-md px-3 py-2 w-min bg-purple"
      />
      {backendErrors.login && (
        <span className=" text-sm mt-1 text-purple self-center">
          {backendErrors.login}
        </span>
      )}
      <div className=" self-center">
        <span className="text-white">Don't have an account? </span>
        <button
          className="text-purple underline"
          onClick={() => setFormState("sign up")}
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default Login;
