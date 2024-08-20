import { NextRequest } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const publicroutes = ["/"];

export const authroutes = ["/login", "/signup"];

const apiAuthPrefix = "/api/auth";

const DEFAULT_LOGIN_REDIRECT = "/dashboard";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  console.log(req.auth)

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicroutes.includes(nextUrl.pathname);

  const isAuthRoute = authroutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if(!req.auth.user.hascompany){
    if(nextUrl.pathname === "/company"){
      return null
    }
    return Response.redirect(new URL("/company", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/(api|trpc)(.*)", "/", "/dashboard", "/company", "/login", "/signup"],
};
