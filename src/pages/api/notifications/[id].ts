import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const handler: NextApiHandler = async (req, res) => {
  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { data: id, error: zodError } = z.string().safeParse(req.query.id);

  if (zodError) {
    res.status(400).json({ error: zodError.errors });
    return;
  }

  if (req.method === "DELETE") {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(204).end();
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};

export default handler;
