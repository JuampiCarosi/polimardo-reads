import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";

export type MyChallenges = {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    created_by: string;
    participants: number;
    book_ids: string[];
    books_read: string[];
}



const handler: NextApiHandler = async (req, res) => {
    if (req.method === "GET") {
        const { id } = req.query;
        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "No id provided" })
        }
        const result = await supabase.rpc("get_user_challenges", {
            user_challenge_id: id
        })



        if (result.error) {
            console.error(result.error);
            return res.status(500).json({ error: result.error.message });
        }

        console.log(result.data);

        
        res.status(200).json(result.data satisfies MyChallenges[]);
    }
}

export default handler;