import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";

export type Likes = {
  liked: boolean;
  likesCount: number;
};

const handler: NextApiHandler = async (req, res) => {
  const text = req.query.text;

  const session = await getServerAuthSession({ req, res });

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (typeof text !== "string") {
    res.status(400).json({ error: "Invalid text" });
    return;
  }

  if (req.method === "POST") {
    await supabase
      .from("updates_likes")
      .insert({ update_liked: text, user_id: session.user.id });

    res.status(200).json({ message: "Liked" });
    return;
  }

  if (req.method === "DELETE") {
    await supabase
      .from("updates_likes")
      .delete()
      .eq("update_liked", text)
      .eq("user_id", session.user.id);

    res.status(200).json({ message: "Unliked" });
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("updates_likes")
      .select("update_liked")
      .eq("update_liked", text)
      .eq("user_id", session.user.id);

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }

    const liked = data.length > 0;

    const { data: likesCount, error: error2 } = await supabase
      .from("updates_likes")
      .select("update_liked")
      .eq("update_liked", text);

    if (error2) {
      console.error(error2);
      res.status(500).json({ error: error2.message });
      return;
    }

    res
      .status(200)
      .json({ liked, likesCount: likesCount.length } satisfies Likes);
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};

export default handler;
