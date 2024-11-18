import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";
import { getCoverBlob } from "../[id]";

export type BookReview = {
  user_id: string | null;
  user_name: string | null;
  user_img: string | null;
  rating: number | null;
  book_id: string;
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

  const { data, error } = await supabase.rpc("get_reviews", {
    input_book_id: result.data.id,
  });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  const reviews = data.map((review) => ({
    user_id: review.user_id,
    user_name: review.user_name,
    user_img: review.user_img,
    book_id: review.book_id,
    review: review.review,
    rating: review.rating,
    created_at: review.created_at,
  }));

  res.status(200).json(reviews);
};

export default handler;
