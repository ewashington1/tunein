import CredentialsProvider from "next-auth/providers/credentials";
import SpotifyProvider from "next-auth/providers/spotify";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import { prisma } from "@/app/api/prisma";
import { createUser } from "@/app/api/prisma/auth/register/route";
import { generateUsername } from "unique-username-generator";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "credentials", //correct fs
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        name: { label: "Password", type: "password" },
        email: { label: "Email", type: "email" },
        id: { label: "Id", type: "text" },
      },
      async authorize(credentials, req) {
        const user = {
          id: credentials!.id,
          name: credentials!.name,
          email: credentials!.email,
          username: credentials!.username,
        };
        return user;
      },
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // called after sign in or when session is accessed in client
    async jwt({ token }) {
      // create jwt using data from matching user
      const matchingUser = await prisma.user.findFirst({
        where: {
          email: token.email!,
        },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
        },
      });
      if (matchingUser) {
        token.id = matchingUser!.id;
        token.name = matchingUser!.name;
        token.email = matchingUser!.email;
        token.username = matchingUser!.username; // works even though error
      }
      return token;
    },

    // called whenever session is checked. sends properties to client
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.username = token.username; // works even though error
        session.user.id = token.id;
      }
      return session;
    },

    // returns whether user can sign in
    async signIn({ user, account, profile, email, credentials }) {
      const matchingUser = await prisma.user.findFirst({
        where: {
          email: user.email!,
        },
        select: {
          id: true,
        },
      });

      // if there is a user with a matching account (same email as spotify email), connect the accounts
      if (matchingUser) {
        return true;
      }
      // if there isn't an account with a matching email
      else {
        const randomStrings = crypto.getRandomValues(new BigUint64Array(2));

        const randomPassword =
          randomStrings[0].toString(36) +
          randomStrings[1].toString(36).toUpperCase();
        try {
          await createUser({
            username: user.id, //spotify id is username basically
            email: user.email,
            password: randomPassword,
            name: user.name,
          });
          return true;
        } catch (err: any) {
          // if username fails unique constraint
          if (err.code === "P2002") {
            const randomUsername = generateUsername("", 3);
            await createUser({
              username: randomUsername, //spotify id is username basically
              email: user.email,
              password: randomPassword,
              name: user.name,
            });
            return true;
          } else {
            return false;
          }
        }
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; //remove get if you dont want default sign in page
