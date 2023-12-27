"use client";

import React, { useContext, useState, useEffect } from "react";
import variables from "../variables.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
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

  const { data: session } = useSession();

  //automatically takes user home if they're logged in
  useEffect(() => {
    if (session) {
      router.push("/home");
    }
  }, [session]);

  const [backendErrors, setBackendErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const login: SubmitHandler<LoginInputs> = async (data) => {
    setLoading(true);
    setBackendErrors({});
    axios
      .post("/api/prisma/auth/login", data)
      .then(async (res) => {
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
        console.log(err);
        if (err.response.data.errors.login) {
          setBackendErrors(err.response.data.errors);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const router = useRouter();

  const setFormState = useContext(FormContext);

  return (
    <form
      onSubmit={handleSubmit(login)}
      className={
        `text-black flex flex-col gap-6 p-6 w-[25%] h-min mr-56 rounded-md bg-boxDarkGrey ` +
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
              signIn("spotify")
                .then(() => {
                  console.log("Signed in via Spotify");
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <img src="spotify_logo.png" alt="Spotify" />
          </button>
          <button
            className={oAuthButtonStyle}
            onClick={() => {
              signIn("google")
                .then(() => {
                  console.log("Signed in via Google");
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <img src="google_logo.png" alt="Spotify" />
          </button>
          <button className={oAuthButtonStyle}></button>
        </div>
      </div>
    </form>
  );
};

export default Login;
