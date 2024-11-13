import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const schema = z.object({
  review: z.string(),
  id: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { review } = req.body;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const parseResult = schema.safeParse({ review, id });

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error });
  }

  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { error } = await supabase.from("book_reviews").insert({
    book_id: parseResult.data.id,
    author: session.user.id,
    review_text: parseResult.data.review,
  });

  if (error) {
    return res.status(500).json({ error: "Error adding review" });
  }

  return res.status(200).json({ message: "Review added" });
};

export default handler;
