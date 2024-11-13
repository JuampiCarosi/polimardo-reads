import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";

export type Challenge = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  start_date: string;
  end_date: string;
  participants: number;
  book_ids: string[];
};

const handler: NextApiHandler = async (req, res) => {
  const challenge_id = req.query.id;

  if (typeof challenge_id !== "string") {
    return res.status(400).json({ error: "Invalid challenge id" });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase.rpc("get_challenge", {
      challenge_id,
    });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    if (!data?.[0]) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    return res.status(200).json(data[0] satisfies Challenge);
  }
};

export default handler;
