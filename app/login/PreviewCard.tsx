import React from "react";
import variables from "../variables.module.scss";

type PreviewCardProps = {
  className?: string;
};

const PreviewCard = ({ className }: PreviewCardProps) => {
  return (
    <div
      className={
        `w-2/5 h-2/5 items-center justify-around text-8xl flex flex-shrink ` +
        className
      }
      style={{
        backgroundColor: variables.lightGrey,
        filter: "drop-shadow(-10px 10px 1px rgba(0, 0, 0, 0.25))",
      }}
    >
      PREVIEW
    </div>
  );
};

export default PreviewCard;
