import { env } from "@/env.mjs";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { dateToMySQLDateString } from "@/lib/utils";
import type { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
  unstable_allowDynamic: [
    // Stripe imports this, but does not use it, so tell build to ignore
    // use a glob to allow anything in the function-bind 3rd party module
    "**/node_modules/function-bind/**",
  ],
};

const webCrypto = Stripe.createSubtleCryptoProvider();

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
      undefined,
      webCrypto
    );
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    await db()
      .update(users)
      .set({
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: dateToMySQLDateString(
          new Date(subscription.current_period_end * 1000)
        ),
      })
      .where(eq(users.id, session?.metadata?.userId as string));
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update the price id and set the new period end.
    await db()
      .update(users)
      .set({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: dateToMySQLDateString(
          new Date(subscription.current_period_end * 1000)
        ),
      })
      .where(eq(users.stripeSubscriptionId, subscription.id));
  }

  return new Response(null, { status: 200 });
}
