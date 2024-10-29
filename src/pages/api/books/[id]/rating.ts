import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

const querySchema = z.object({
  id: z.string(),
});
const bodySchema = z.object({
  rating: z.number().min(1).max(5).nullable(),
});

export type BookRating = {
  book_id: string;
  created_at: string;
  id: string;
  rating: number;
  user_id: string;
} | null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const queryResult = querySchema.safeParse(req.query);
  const bodyResult = bodySchema.safeParse(await req.body);

  if (!queryResult.success) {
    console.log("Query result error");
    console.log(queryResult.error);
    return res.status(400).json({ error: queryResult.error });
  }

  if (!bodyResult.success) {
    console.log("Body result error");
    console.log(bodyResult.error);
    return res.status(400).json({ error: bodyResult.error });
  }

  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!bodyResult.data.rating) {
    const { error } = await supabase
      .from("books_ratings")
      .delete()
      .eq("user_id", session.user.id)
      .eq("book_id", queryResult.data.id);

    if (error) {
      console.error(error);
      res.status(500).json({
        error:
          error?.message ?? "Unexpected error happend deleting book status",
      });
      return;
    }

    res.status(200).json(null);
    return;
  }

  const { data, error } = await supabase
    .from("books_ratings")
    .upsert(
      {
        user_id: session.user.id,
        book_id: queryResult.data.id,
        rating: bodyResult.data.rating,
      },
      { onConflict: "user_id, book_id" },
    )
    .select("*");

  if (error || !data) {
    console.error(error);
    res.status(500).json({
      error: error?.message ?? "Unexpected error happend updating book status",
    });
    return;
  }

  if (data.length !== 1) {
    console.error("Data length of upsert is not 1, prohibeted status");
    console.log(data);
    res.status(500).json({
      error: "Unexpected error happend updating book status",
    });
    return;
  }

  res.status(200).json(data[0]! satisfies BookRating);
}
