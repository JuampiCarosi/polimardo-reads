import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";

export type Genres = {
  id: string;
  name: string;
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { data, error } = await supabase.from("genres").select("*");
  
  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data satisfies Genres[]);
};

export default handler;
