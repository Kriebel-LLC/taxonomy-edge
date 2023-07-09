// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { UserSubscriptionPlan } from "types";
import { freePlan, proPlan } from "@/config/subscriptions";
import { getOrCreateUserRecord } from "./auth";

const dayInMilliseconds = 86_400_000;

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await getOrCreateUserRecord(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const stripeCurrentPeriodEndMs = new Date(
    user.stripeCurrentPeriodEnd
  ).getTime();

  // Check if user is on a pro plan.
  const isPro =
    user.stripePriceId &&
    stripeCurrentPeriodEndMs + dayInMilliseconds > Date.now();

  const plan = isPro ? proPlan : freePlan;

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: stripeCurrentPeriodEndMs,
    isPro,
  };
}
