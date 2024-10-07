import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import axios from "axios";
// Your own logic for dealing with plaintext password strings; be careful!
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { baseUrl } from "./utils/constants";
import { signOut } from "./auth";


// async function refreshAccessToken(token: any) {
//   try {
//     const url = ""
//     const response = await fetch(url, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       method: "POST",
//     })

//     const refreshedTokens = await response.json()

//     if (!response.ok) {
//       throw refreshedTokens
//     }

//     return {
//       ...token,
//       access_token: refreshedTokens.access_token,
//       accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
//       refresh_token: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
//     }
//   } catch (error) {
//     console.log(error)

//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     }
//   }
// }


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
        let user = null;

        const res = await axios.post(
          baseUrl + "auth/login",
          {
            email: credentials.email,
            password: credentials.password,
          }
        );


        console.log(res)



        if (res.status === 200) {
          user = res.data;
        }
        return user;
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
    maxAge: 15 * 60,
    updateAge: 10 * 60
  },
  callbacks: {
    jwt: async ({ token, user, profile, session, account, trigger }) => {
      if (trigger === "update") {
        if (session?.hascompany) {
          token.hascompany = session?.hascompany

        } else if (session?.company) {
          token.companyId = session?.company;

        } else if (session?.isSubscribed) {
          token.isSubscribed = session?.isSubscribed
        }


      } else {
        if (!profile) {
          if (user) {
            token.userId = (user as any)?.userId;
            token.access_token = (user as any)?.accessToken;
            token.refresh_token = (user as any)?.refreshToken;
            token.hascompany = (user as any)?.hascompany;
            token.companyId = (user as any)?.companyId;
            token.role = (user as any)?.role;
            token.isSubscribed = (user as any)?.isSubscribed;

          }

        } else {
          try {
            const res = await axios.post(process.env.BASEURL! + "auth/google", {
              firstname: profile?.given_name,
              lastname: profile?.family_name,
              email: profile?.email,
              googleId: account?.providerAccountId,
            });



            if (res.status === 200 || res.status === 201) {
              token.access_token = res.data?.data?.token?.accessToken;
              token.refresh_token = res.data?.data?.token?.refreshToken;
              token.hascompany = res.data?.data?.token?.hascompany;
              token.companyId = res.data?.data?.token?.companyId;
              token.role = res.data?.data?.token?.role;
              token.userId = res.data?.data?.token?.userId;
              token.isSubscribed = res.data?.data?.token?.isSubscribed;
            } else {
              return null
            }

          } catch (error) {
            console.error("Error fetching tokens from your API:", error);
            return null
          }
        }
      }


      return token;
    },
    session: async ({ session, token }) => {
      console.log(token)
      return {
        ...session,
        user: {
          ...session?.user,
          access_token: token?.access_token!,
          refresh_token: token?.refresh_token!,
          hascompany: token?.hascompany!,
          companyId: token?.companyId!,
          role: token?.role,
          userId: token?.userId,
          isSubscribed: token?.isSubscribed
        }
      }
    },
  },
  secret: process.env.AUTH_SECRET!,
  pages: {
    // signIn: "/login",
    error: '/auth/error',
  },
} satisfies NextAuthConfig;
