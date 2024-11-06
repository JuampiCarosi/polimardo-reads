import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";
import { type BookRaw } from "./[id]";

const search_schema = z.object({
  q: z.string(),
  filter: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  const result = search_schema.safeParse(req.query);
  if (!result.success) return res.status(400).json({ error: result.error });
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { data, error } = await supabase.rpc("search_books", {
    input_value: result.data.q,
    filter_type: result.data.filter,
  });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  const books = data.map((v) => ({
    ...v,
    genres: v.genres.replace(/[\[\]']/g, "").split(",") ?? [],
  }));

  res.status(200).json(books satisfies BookRaw[]);
};

export default handler;
