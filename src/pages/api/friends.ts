import { supabase, authDB } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const postSchema = z.object({
    id: z.string(),
    friend_id: z.string(),
});

export type Friend = {
    user_id: string;
    friend_id: string;
    is_added: boolean | null;
    created_at: string;
}

const handler: NextApiHandler = async (req, res) => {

    if (req.method === "POST") {

        console.log(req.body);
        const result = postSchema.safeParse(req.body);
        console.log(result);
        if (!result.success) {
            console.log(result.error);
            return res.status(400).json({ error: result.error });
        }

        const { id, friend_id } = result.data;

        console.log(id, friend_id);

        const { error } = await supabase.from("friendships").insert({
            user_id: id,
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

    if (req.method === "GET") {

        const { data, error } = await supabase
            .from("friendships")
            .select("*")

        if (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data satisfies Friend[]);
        return;
    }
};

export default handler;