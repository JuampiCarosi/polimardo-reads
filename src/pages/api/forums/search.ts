import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";
import { type Forum } from ".";

const search_schema = z.object({
  q: z.string(),
});

export type ForumSearch = {
  id: string;
  name: string;
  status: boolean;
  created_by: string;
  discussions: number;
};

const handler: NextApiHandler = async (req, res) => {
  const result = search_schema.safeParse(req.query);
  if (!result.success) return res.status(400).json({ error: result.error });
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { data, error } = await supabase.rpc("get_forums", {
    input: result.data.q,
  });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data satisfies ForumSearch[]);
};

export default handler;
