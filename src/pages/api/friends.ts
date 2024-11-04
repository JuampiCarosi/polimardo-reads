import { supabase, authDB } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const postSchema = z.object({
    id: z.string(),
    friend_id: z.string(),
});

const handler: NextApiHandler = async (req, res) => {

    const result = postSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }

    const { id, friend_id } = result.data;

    const { error } = await supabase.from("friendships").insert({
        user_id: id,
        friend_id: friend_id,
    });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "Friend added" });
    return;
};

export default handler;