import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import axios from "axios";
// Your own logic for dealing with plaintext password strings; be careful!
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default {
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the credentials object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "email", type: "email", required: true },
        password: { label: "password", type: "password", required: true },
      },
      authorize: async (credentials) => {
        console.log(credentials, "cred");
        let user = null;

      
          const res = await axios.post(
            "http://localhost:8000/api/v1/auth/login",
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          console.log(res)

          if (res.status === 200) {
            return user = res.data;
          }else{
            return user;

          }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // profile(profile) {
      //   return {
      //     id: profile.sub,
      //     given_name: profile.given_name,
      //     family_name: profile.family_name,
      //     email: profile.email,
      //     image: profile.picture,
      //   };
      // },
    }),
    
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, profile, account }) => {

      if (!profile) {
        if (user) {
          token.id = user?.id;
          token.access_token = (user as any)?.accessToken;
          token.refresh_token = (user as any)?.refreshToken;
          token.hascompany = (user as any)?.hascompany;
        }

      } else {
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
      }
      return token;
    },
    session: async ({ session, token }) => {
      session={
        ...session,
        ...token
      }
      session.user.access_token = token?.access_token!;
      session.user.refresh_token = token?.refresh_token!;
      session.user.hascompany = token?.hascompany!;

      return session;
    },
  },
  secret: process.env.AUTH_SECRET!,
  pages: {
    // signIn: "/login",
  },
} satisfies NextAuthConfig;
