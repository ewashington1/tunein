import AuthenticatedLayout from "@/app/components/layout/AuthenticatedLayout";
import React from "react";

const page = ({ params }: { params: { userId: string } }) => {
  return (
    <AuthenticatedLayout>
      <div>Profile</div>
    </AuthenticatedLayout>
  );
};

export default page;
