import { db } from "@/db";
import { RequiresProPlanError } from "@/lib/exceptions";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { getCurrentServerUser } from "@/lib/session";
import * as z from "zod";
import { posts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";

export const runtime = "edge";

const postCreateSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getCurrentServerUser(cookies());

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { uid } = session;
    const postRecords = await db()
      .select({
        id: posts.id,
        title: posts.title,
        published: posts.published,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .where(eq(posts.authorId, uid));

    return new Response(JSON.stringify(postRecords));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentServerUser(cookies());

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { uid } = session;
    const subscriptionPlan = await getUserSubscriptionPlan(uid);

    // If user is on a free plan.
    // Check if user has reached limit of 3 posts.
    if (!subscriptionPlan?.isPro) {
      const countQuery = await db()
        .select({
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(posts)
        .where(eq(posts.authorId, uid));

      const count = countQuery[0].count;

      if (count >= 3) {
        throw new RequiresProPlanError();
      }
    }

    const json = await req.json();
    const body = postCreateSchema.parse(json);

    const postId = nanoid();

    await db().insert(posts).values({
      id: postId,
      title: body.title,
      content: body.content,
      authorId: session.uid,
    });

    return new Response(JSON.stringify({ id: postId }));
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    if (error instanceof RequiresProPlanError) {
      return new Response("Requires Pro Plan", { status: 402 });
    }

    return new Response(null, { status: 500 });
  }
}
