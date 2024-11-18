import { supabase } from "@/server/supabase";
import type { NextApiHandler } from "next";
import { z } from "zod";

const joinSchema = z.object({
    userId: z.string(),
    challengeId: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "POST") {
        const result = joinSchema.safeParse(req.body);
        if (!result.success) {
            console.log(result.error.message);
            return res.status(400).json({ error: result.error });
        }
        
        const joinData = {
            challenge_id: result.data.challengeId,
            user_id: result.data.userId,
        };

        const { data, error } = await supabase.from("challenges_participants").insert(joinData).select("*");
        if (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }

        res.status(201).json(data[0]);
        return;
    }

    if (req.method === "DELETE") {
        const result = joinSchema.safeParse(req.body);
        if (!result.success) {
            console.log(result.error.message);
            return res.status(400).json({ error: result.error });
        }

        const { error } = await supabase
            .from("challenges_participants")
            .delete()
            .eq("challenge_id", result.data.challengeId)
            .eq("user_id", result.data.userId);

        if (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }

        res.status(204).end();
        return;
    }
}

export default handler;