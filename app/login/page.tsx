"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import Register from "./Register";
import PreviewCard from "./PreviewCard";
import Login from "./Login";
import { createContext } from "react";

//In short, Dispatch is a type for functions that can send actions to be handled by some system.
// the ! in null! is basically telling TypeScript that the default value won't be null at runtime (it's a postfix expression)
export const FormContext = createContext<Dispatch<SetStateAction<string>>>(
  null!
);

const page = () => {
  console.log("Login page");
  const [formState, setFormState] = useState("sign in");

  return (
    <FormContext.Provider value={setFormState}>
      <div className="flex h-screen relative items-center">
        <PreviewCard className=" ml-[13%]" />
        <div className="w-[1px] bg-white h-3/5 m-auto"></div>
        {formState === "sign up" ? (
          <Register className="mr-[13%]" />
        ) : (
          <Login className="mr-[13%]" />
        )}
      </div>
    </FormContext.Provider>
  );
};

export default page;
