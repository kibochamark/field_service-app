import { NextRequest } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const publicroutes = ["/"];

export const authroutes = ["/login", "/signup"];

const apiAuthPrefix = "/api/auth";

const DEFAULT_LOGIN_REDIRECT = "/callpro/dashboard";

const { auth } = NextAuth(authConfig);

export default auth(async(req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const date = new Date()

  
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


  if (!(req?.auth?.user?.hascompany)) {
    if (nextUrl.pathname === "/company") {
      return null
    }
    return Response.redirect(new URL("/company", nextUrl));
  }

  if (nextUrl.pathname === "/company") {
    return Response.redirect(new URL("/callpro/dashboard", nextUrl))
  }

  if(!(req?.auth?.user?.isSubscribed)){
    if(nextUrl.pathname === "/subscribe"){
      return null
    }
    return Response.redirect(new URL("/subscribe", nextUrl));
  }

  if (nextUrl.pathname === "/subscribe") {
    return Response.redirect(new URL("/callpro/dashboard", nextUrl))
  }

  return null;
});

export const config = {
  matcher: ["/(api|trpc)(.*)", "/", "/subscribe", "/company", "/callpro/:path*", "/login", "/signup"],
};
