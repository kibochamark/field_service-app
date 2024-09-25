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
      companyId: string;
      role:string;
      userId: string;
    } & DefaultSession["user"];
  }

  interface User {
    access_token: string;
    refresh_token: string;
    companyId: string;
    hascompany: boolean;
    userId: string;
  }

  interface Token {
    access_token: string;
    refresh_token: string;
    hascompany: boolean;
    companyId: string;
    userId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    id?: string;
    hascompany?: boolean;
    companyId?: string;
    userId: string;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
