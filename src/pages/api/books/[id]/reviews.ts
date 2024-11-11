import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";
import { getCoverBlob } from "../[id]";

export type BookReview = {
  author_id: string | null;
  review: string;
  created_at: string;
};

const schema = z.object({
  id: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const result = schema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const { data, error } = await supabase 
    .from("book_reviews")
    .select("review_text, created_at, author")
    .eq("book_id", result.data.id);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  const reviews = data
  .filter((review) => review.review_text !== null)
  .map((review) => ({
    author_id: review.author,
    review: review.review_text,
    created_at: review.created_at,
  }));

  res.status(200).json(reviews);
};

export default handler;
