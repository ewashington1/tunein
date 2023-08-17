import React from "react";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";

const page = () => {
  return (
    <AuthenticatedLayout>
      <div className="text-white flex items-center font-bold text-8xl justify-center">
        Explore
      </div>
    </AuthenticatedLayout>
  );
};

export default page;
