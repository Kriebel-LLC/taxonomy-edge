import { setAuthCookies } from "next-firebase-auth-edge/lib/next/cookies";
import type { NextRequest } from "next/server";
import { authConfig, getAuthorizationTokenFromHeader } from "@/lib/auth";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
  if (req.method !== "GET") {
    return new Response(null, { status: 405 });
  }

  if (!getAuthorizationTokenFromHeader(req.headers)) {
    return new Response(null, { status: 401 });
  }

  try {
    return setAuthCookies(req.headers, {
      cookieName: authConfig.cookieName,
      cookieSerializeOptions: authConfig.cookieSerializeOptions,
      cookieSignatureKeys: authConfig.cookieSignatureKeys,
      serviceAccount: authConfig.serviceAccount,
      apiKey: authConfig.apiKey,
    });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 401 });
  }
}
