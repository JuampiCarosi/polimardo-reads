import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";

export type Notification = {
  created_at: string;
  url: string | null;
  id: string;
  is_read: boolean;
  title: string;
  user_id: string;
};

const handler: NextApiHandler = async (req, res) => {
  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_read", false);

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data satisfies Notification[]);
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};

export default handler;
