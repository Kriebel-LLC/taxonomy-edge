import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { authConfig } from "@/lib/auth";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function getCurrentServerUser(
  requestCookies: RequestCookies | ReadonlyRequestCookies
) {
  const tokens = await getTokens(requestCookies, authConfig);

  return tokens?.decodedToken;
}
