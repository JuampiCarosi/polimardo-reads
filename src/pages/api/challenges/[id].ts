import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

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

const putSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  created_by: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  participants: z.number(),
  book_ids: z.array(z.string()),
});

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

  if (req.method === "PUT") {
    const result = putSchema.safeParse(req.body);
    if (!result.success) {
      console.log(result.error.message);
      return res.status(400).json({ error: result.error });
    }

    const challengeData = {
      id: result.data.id,
      name: result.data.name,
      description: result.data.description,
      created_by: result.data.created_by,
      start_date: result.data.start_date,
      end_date: result.data.end_date,
      participants: result.data.participants,
      book_ids: result.data.book_ids,
    };

    const { data, error } = await supabase.from("challenges").upsert(challengeData);

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
