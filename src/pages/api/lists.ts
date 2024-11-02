import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";

import { z } from "zod";

const postSchema = z.object({
    title: z.string(),
    description: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    console.log("BODY", req.body);
    const result = postSchema.safeParse(req.body);
    console.log("RESULT", result);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const list = result.data;
    const list_creator_session = await getServerAuthSession({ req, res });
    const list_creator = list_creator_session?.user.id;
    
    if (!list_creator) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase.from("lists").insert({
        name: list.title,
        description: list.description,
        createdBy: list_creator,
    });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  }
};

export default handler;