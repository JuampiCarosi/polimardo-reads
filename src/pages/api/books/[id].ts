import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import {z} from "zod";

export type Book =  {
    book_author: string;
    book_title: string;
    created_at: string;
    id: string;
    image_url_1: string | null;
    image_url_2: string | null;
    image_url_3: string | null;
    isbn: string;
    publish_year: number;
    publisher: string;
}

const schema = z.object({
    id: z.string(),
});



const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET"){
    return res.status(405).json({ error: "Method not allowed" });
  }
  const result = schema.safeParse(req.query);
  if (!result.success){
    return res.status(400).json({ error: result.error });
  }

  const { data, error } = await supabase.from("books").select("*").eq("id", result.data.id);

  if (error || !data || data.length === 0) {
    console.error(error);
    return res.status(500).json({ error: error?.message?? "Book not found" });
  }

  res.status(200).json(data[0]! satisfies Book);
};

export default handler;
