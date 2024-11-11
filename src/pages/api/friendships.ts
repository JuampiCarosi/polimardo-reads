import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const patchSchema = z.object({
  id: z.string(),
  is_added: z.boolean(),
});

const postSchema = z.object({
  user_id: z.string(),
  friend_id: z.string(),
});

const deleteSchema = z.object({
  id: z.string(),
});

export type FriendshipRaw = {
  id: string;
  user_id: string;
  friend_id: string;
  is_added: boolean | null;
  created_at: string;
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const result = postSchema.safeParse(req.body);

    if (!result.success) {
      console.log(result.error);
      return res.status(400).json({ error: result.error });
    }

    const { user_id, friend_id } = result.data;

    const { error } = await supabase.from("friendships").insert({
      user_id: user_id,
      friend_id: friend_id,
      is_added: false,
    });

    if (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "Friend added" });
    return;
  }

  if (req.method === "PATCH") {
    const result = patchSchema.safeParse(req.body);

    if (!result.success) {
      console.log(result.error);
      return res.status(400).json({ error: result.error });
    }

    const { id, is_added } = result.data;

    const { error } = await supabase
      .from("friendships")
      .update({
        is_added: is_added,
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "Friend updated" });
    return;
  }

  if (req.method === "DELETE") {
    const result = deleteSchema.safeParse(req.body);

    if (!result.success) {
      console.log(result.error);
      return res.status(400).json({ error: result.error });
    }

    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", result.data.id);

    if (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "Friend deleted" });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};

export default handler;
