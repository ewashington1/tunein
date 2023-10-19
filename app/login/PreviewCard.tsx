import React from "react";
import variables from "../variables.module.scss";

type PreviewCardProps = {
  className?: string;
};

const PreviewCard = ({ className }: PreviewCardProps) => {
  return (
    <div
      className={
        `w-2/5 items-center justify-around text-8xl relative flex flex-shrink border-solid border-white border bg-white ` +
        className
      }
      style={{
        backgroundColor: variables.lightGrey,
        filter: "drop-shadow(-10px 10px 1px rgba(0, 0, 0, 0.50))",
      }}
    >
      <img
        className=" opacity-40"
        src="/photos/tunein_preview.png"
        alt="Preview"
      />
      <h1 className=" self-center absolute font-extrabold text-9xl text-purple stroke-white stroke-2">
        TuneIn
      </h1>
    </div>
  );
};

export default PreviewCard;
