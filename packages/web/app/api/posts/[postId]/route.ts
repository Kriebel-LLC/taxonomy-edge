import { db } from "@/db";
import { postPatchSchema } from "@/lib/validations/post";
import * as z from "zod";
import { posts } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { getCurrentServerUser } from "@/lib/session";
import { cookies } from "next/headers";

export const runtime = "edge";

const routeContextSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
});

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context);

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(req, params.postId))) {
      return new Response(null, { status: 403 });
    }

    // Delete the post.
    await db()
      .delete(posts)
      .where(eq(posts.id, params.postId as string));

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context);

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(req, params.postId))) {
      return new Response(null, { status: 403 });
    }

    // Get the request body and validate it.
    const json = await req.json();
    const body = postPatchSchema.parse(json);

    // Update the post.
    // TODO: Implement sanitization for content.
    await db()
      .update(posts)
      .set({ title: body.title, content: body.content })
      .where(eq(posts.id, params.postId));

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

async function verifyCurrentUserHasAccessToPost(req: Request, postId: string) {
  const session = await getCurrentServerUser(cookies());
  if (!session) {
    return false;
  }

  const countQuery = await db()
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(posts)
    .where(and(eq(posts.id, postId), eq(posts.authorId, session?.uid)));

  return countQuery[0].count > 0;
}
