import { env } from "@/env.mjs";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
  typescript: true,
  httpClient: Stripe.createFetchHttpClient(), // ensure we use a Fetch client, and not Node's `http`
});
