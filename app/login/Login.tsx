"use client";

import React, { useContext, useState, useEffect } from "react";
import variables from "../variables.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import { redirect, useRouter } from "next/navigation";
import { FormContext } from "./page";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { oAuthButtonStyle } from "./styles";

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

  //automatically takes user home if they're logged in

  const [backendErrors, setBackendErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/home");
    }
  });

  const login: SubmitHandler<LoginInputs> = async (data) => {
    setLoading(true);
    setBackendErrors({});
    axios
      .post("/api/prisma/auth/login", data)
      .then(async (res) => {
        await signIn("credentials", {
          // callbackUrl: "/home",
          username: res.data.user.username,
          id: res.data.user.id,
          email: res.data.user.email,
          name: res.data.user.name,
          redirect: false,
        });
        router.replace("/home");
      })
      .catch((err) => {
        //username error is present
        console.log(err);
        if (err.response.data.errors.login) {
          setBackendErrors(err.response.data.errors);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setFormState = useContext(FormContext);

  return (
    <div
      className={
        `text-black flex flex-col gap-6 p-6 w-[25%] mr-56 rounded-md bg-boxDarkGrey ` +
        className
      }
    >
      <form
        onSubmit={handleSubmit(login)}
        className={`text-black flex flex-col gap-6`}
      >
        <div className="flex flex-col">
          <label className="text-white mb-1" htmlFor="usernameOrEmail">
            Username or Email
          </label>
          <input
            className="h-6 py-6 px-3 rounded-md bg-lightGrey focus:outline-none focus:ring-purple focus:ring-2"
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
            className="h-6 py-6 px-3 rounded-md bg-lightGrey focus:outline-none focus:border-purple focus:border-2"
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

        {loading ? (
          <input
            type="submit"
            value="Signing In"
            className="text-white self-end rounded-md px-3 py-2 w-min bg-purple cursor-pointer"
          />
        ) : (
          <input
            type="submit"
            value="Sign In"
            className="text-white self-end rounded-md px-3 py-2 w-min bg-purple cursor-pointer"
          />
        )}

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

      <hr />

      {/* different Oauth methods */}
      <div className="flex flex-col self-center">
        <p className="mb-3 self-center text-white text-lg block">
          ...or sign in with:
        </p>
        <div className="self-center gap-4 flex ">
          <button
            className={oAuthButtonStyle}
            onClick={() => {
              setLoading(true);
              signIn("spotify")
                .then(() => {
                  console.log("Signed in via Spotify");
                })
                .catch((err) => {
                  console.log(err);
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            <img src="spotify_logo.png" alt="Spotify" />
          </button>
          <button
            className={oAuthButtonStyle}
            onClick={() => {
              setBackendErrors({ login: undefined });
              signIn("google")
                .then(() => {
                  console.log("Signed in via Google");
                })
                .catch((err) => {
                  console.log(err);
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            <img src="google_logo.png" alt="Spotify" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
