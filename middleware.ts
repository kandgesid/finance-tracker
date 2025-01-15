import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


const isProtectedRoute = createRouteMatcher([
    "/",
])
export default clerkMiddleware( async (auth, request) => {
   if(isProtectedRoute(request)){
        await auth.protect();
    }
   return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!.+.[w]+$|_next).*)", "/", 
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};