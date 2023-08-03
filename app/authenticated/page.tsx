"use client";

import React, { useState } from "react";

//types associated with useState -> https://www.carlrippon.com/typed-usestate-with-typescript/
//hook form with ts: https://react-hook-form.com/get-started

const page = () => {
  const [state, setState] = useState();
  return <div>page</div>;
};

export default page;
