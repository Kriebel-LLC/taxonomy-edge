import {
  authConfig,
  getAuthorizationTokenFromHeader,
  getOrCreateUserRecord,
} from "@/lib/auth";
import { getFirebaseAuth } from "next-firebase-auth-edge/lib/auth";
import { setAuthCookies } from "next-firebase-auth-edge/lib/next/cookies";

export const runtime = "edge";

// special function so we can getOrCreateUserRecord in DB rather than just adding cookies
export async function GET(req: Request) {
  const token = getAuthorizationTokenFromHeader(req.headers);
  if (!token) {
    return new Response(null, { status: 401 });
  }
  const firebaseAuth = getFirebaseAuth(authConfig);

  try {
    // verifyIdToken is called within setAuthCookies, but we duplicate it here to pull out the decodedToken
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    const response = setAuthCookies(req.headers, {
      cookieName: authConfig.cookieName,
      cookieSerializeOptions: authConfig.cookieSerializeOptions,
      cookieSignatureKeys: authConfig.cookieSignatureKeys,
      serviceAccount: authConfig.serviceAccount,
      apiKey: authConfig.apiKey,
    });

    await getOrCreateUserRecord(decodedToken.uid);

    return response;
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 401 });
  }
}
