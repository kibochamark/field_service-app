import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { JWT } from "next-auth/jwt";
import { type DefaultSession } from "next-auth";
import axios from "axios";

declare module "next-auth" {
  interface Session {
    user: {
      access_token: string;
      refresh_token: string;
      hascompany: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    access_token: string;
    refresh_token: string;
    hascompany: boolean;
  }

  interface Token {
    access_token: string;
    refresh_token: string;
    hascompany: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    id?: string;
    hascompany?: boolean;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, profile, account }) => {


      // This condition checks if we are dealing with a Google account
      if (account?.providerAccountId && profile?.email) {
        try {
          const res = await axios.post("http://localhost:8000/api/v1/auth/google", {
            firstname: profile?.given_name,
            lastname: profile?.family_name,
            email: profile?.email,
            googleId: account?.providerAccountId,
          });

          if (res.status === 200 || res.status === 201) {
            token.access_token = res.data?.data?.token?.accessToken;
            token.refresh_token = res.data?.data?.token?.refreshToken;
            token.hascompany = res.data?.data?.token?.hascompany;
          }
        } catch (error) {
          console.error("Error fetching tokens from your API:", error);
        }
      } else {
        console.log(token, "jwt, google token");
        // This condition is for handling when a user object is available (e.g., after sign-in)
        if (user) {
          token.id = user.id;
          token.access_token = (user as any).access_token;
          token.refresh_token = (user as any).refresh_token;
          token.hascompany = (user as any).hascompany;
        }

        console.log(token, "jwt, token");
      }



      return token;
    },
    session: async ({ session, token }) => {
      console.log(token, "token", session, "session");
      session.user.access_token = token.access_token!;
      session.user.refresh_token = token.refresh_token!;
      session.user.hascompany = token.hascompany!;

      console.log(session);
      return session;
    },
  },
  secret: process.env.AUTH_SECRET!,
  pages: {
    signIn: "/login",
  },
});
