import React from "react";

//song lyrics body
export const SongLyricsBody = ({
  lyrics,
}: {
  lyrics: string | null | undefined;
}): React.ReactNode => {
  return (
    <div className="flex flex-col text-xl gap-3">
      <h1 className="font-bold text-3xl">Lyrics</h1>

      <p className=" font-extralight whitespace-pre-wrap text-base">
        {lyrics ? lyrics : null}
      </p>
    </div>
  );
};
