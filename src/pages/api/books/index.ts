import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { type BookRaw } from "./[id]";

import { type Book } from "./[id]";
import { z } from "zod";

const postSchema = z.object({
      title: z.string(),
      series: z.string(),
      description: z.string(),
      language: z.string(),
      isbn: z.string(),
      cover_img: z.string(),
      publish_year: z.number(),
      author: z.string(),
      genres: z.string(),
      publisher: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    console.log("BODY", req.body);
    const result = postSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const book = result.data;

    

    const { data, error } = await supabase.from("books_detailed").insert(book);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  }
  

  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { data, error, count, status } = await supabase
    .from("books_detailed")
    .select("*");

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
  console.log("COUNT", count);
  console.log("STATUS", status);

  res.status(200).json(data satisfies BookRaw[]);
};

export default handler;
