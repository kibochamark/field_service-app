import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by auth, useSession, getSession and received as a prop on the SessionProvider React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      acess_token: string;
      refresh_token: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
    expires: string;
    data: {
      access: string;
      refresh: string;
    };
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
    jwt: async ({ token, user, profile }) => {
      if (user) token = user as unknown as { [key: string]: any };
      return token;
    },
    session: async ({ session, token }) => {
      session = {
        ...session,
        ...token,
      };
      return session;
    },
  },
  secret: process.env.AUTH_SECRET!,
  pages: {
    signIn: "/login",
  },
});
