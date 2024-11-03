import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const schema = z.object({
  comment: z.string(),
  id: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const { id } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { comment } = req.body;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parseResult = schema.safeParse({ comment, id });

    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error });
    }

    const session = await getServerAuthSession({ req, res });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { error } = await supabase.from("lists_comments").insert({
      list_id: parseResult.data.id,
      user_id: session.user.id,
      comment: parseResult.data.comment,
    });

    if (error) {
      return res.status(500).json({ error: "Error adding comment" });
    }

    return res.status(200).json({ message: "Comment added" });
  }

  return res.status(405).json({ error: "Method not allowed" });
};

export default handler;
