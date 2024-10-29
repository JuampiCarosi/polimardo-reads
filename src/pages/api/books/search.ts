import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";
import { type BookRaw } from "./[id]";

const search_schema = z.object({
  book: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  const result = search_schema.safeParse(req.query);
  if (!result.success) return res.status(400).json({ error: result.error });
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { data, error } = await supabase.rpc("get_similar_books_v2", {
    input_book_title: result.data.book,
  });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data satisfies BookRaw[]);
};

export default handler;
