import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

// Get the NEXTAUTH_SECRET from environment
const getAuthSecret = () => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.warn('NEXTAUTH_SECRET is not set. Using fallback for development.');
    return 'development-secret-key-change-in-production';
  }
  return secret;
};

export const authConfig = {
  secret: getAuthSecret(),
  providers: [],
  callbacks: {
    authorized({ request, auth }: any) {
      //array of regular expression of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        // /\/admin/, // Admin panel accessible without authentication
      ];

      //get pathname from the request url object
      const { pathname } = request.nextUrl;

      //check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      // check session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        //Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        //clone the req headers
        const newRequestHeaders = new Headers(request.headers);

        //create the new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        //set newly generated sessonCardId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;
