import { setAuthCookies } from "next-firebase-auth-edge/lib/next/cookies";
import { authConfig } from "@/lib/auth";

export const runtime = "edge";

export default async function handler(req) {
  if (req.method !== "GET") {
    return new Response(null, { status: 405 });
  }

  let response;
  try {
    response = await setAuthCookies(req.headers, {
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

  return response;
}
