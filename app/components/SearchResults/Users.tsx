import React, { useEffect, useState } from "react";
import axios from "axios";
import { prisma } from "../../api/prisma";
import { User } from "@prisma/client";
import UserCard from "../cards/UserCard";

type UsersProps = {
  searchTerm: string;
};

const Users = ({ searchTerm }: UsersProps) => {
  const [userSearchResults, setUserSearchResults] = useState<User[] | null>(
    null
  );
  useEffect(() => {
    const getSearchResults = async () => {
      axios
        .post("/api/prisma/searchUsers", {
          searchTerm: searchTerm,
        })
        .then((res) => {
          setUserSearchResults(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getSearchResults();
  }, [searchTerm]);
  if (userSearchResults === null) {
    return (
      <div className="flex mt-4 font-bold h-[80vh] overflow-y-scroll justify-center text-2xl lightGreyScrollbar">
        <div>Loading users...</div>
      </div>
    );
  } else if (userSearchResults.length === 0) {
    return (
      <div className="flex mt-4 font-bold h-[80vh] overflow-y-scroll justify-center text-2xl lightGreyScrollbar">
        <div>No results :(</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col mt-4 h-[80vh] overflow-y-scroll lightGreyScrollbar">
      {userSearchResults.map((user, index) => (
        // fix type error
        <UserCard key={index} user={user} />
      ))}
    </div>
  );
};

export default Users;
