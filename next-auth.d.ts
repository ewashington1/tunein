import NextAuth from "next-auth";

//extends the seesion to include user id and
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }

  interface User {
    username: string & AdapterUser;
  }
}
