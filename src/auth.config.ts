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

        if (res.status === 200) {
          user = res.data;
        }
        // return user object with their profile data
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
} satisfies NextAuthConfig;
