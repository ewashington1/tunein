import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

const authOptions: NextAuthOptions = {
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
  ],
  pages: {
    // signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  //   JWT: When a user logs in, next-auth generates a JWT that contains user information. This token can be customized with the jwt callback in your configuration. This token is signed, sent to the client, and stored securely in an HTTP-only cookie. On each request, this token is sent to the server, decoded, and the user information is extracted.

  // Session: When you fetch the session on the client side using the useSession hook or getSession method, you're actually getting a representation of the user derived from the aforementioned JWT. The session callback in your next-auth configuration allows you to shape what this representation looks like. The session is a client-friendly way of looking at the user's data without exposing the raw JWT or all of its contents.
  callbacks: {
    //returned user initializes jwt
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.username = user.username; // works even though error
      }
      return token;
    },

    //jwt info is stored in session, fields based on this
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.username = token.username; // works even though error
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; //remove get if you dont want default sign in page
