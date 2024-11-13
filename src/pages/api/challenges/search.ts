import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const search_schema = z.object({
  q: z.string(),
});

export interface GeneralChallengeData {
  challenge_id: string;
  book_ids: string[];
  challenge_name: string;
  challenge_description: string;
  participant_count: number;
}

const handler: NextApiHandler = async (req, res) => {
  const result = search_schema.safeParse(req.query);
  if (!result.success) return res.status(400).json({ error: result.error });
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { data, error } = await supabase.rpc("get_challenges", {
    input: result.data.q,
  });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data satisfies GeneralChallengeData[]);
};

export default handler;
