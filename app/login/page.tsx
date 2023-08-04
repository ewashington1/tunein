import React from "react";
import Register from "./Register";
import PreviewCard from "./PreviewCard";

const page = () => {
  return (
    <div className="flex h-screen relative items-center">
      <PreviewCard className=" ml-[13%]" />
      <div className="w-[1px] bg-white h-3/5 m-auto"></div>
      <Register className="mr-[13%]" />
    </div>
  );
};

export default page;
