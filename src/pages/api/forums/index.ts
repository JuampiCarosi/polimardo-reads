import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";


export type Forum = {
    id: string;
    name: string;
    discussions_count: number;
    status: boolean;
}





const handler: NextApiHandler = async (req, res) => {
    if (req.method === "POST") {
        const session = await getServerAuthSession({ req, res });

        if (!session?.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const parseResult = z
            .object({ title: z.string()})
            .safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error });
            return;
        }

        const { data, error } = await supabase
            .from("forums")
            .insert({
                name: parseResult.data.title,
                created_by: session.user.id,
            })
            .select("id")

        if (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }

        res.status(201).json(data[0]);
    }


    if (req.method === "GET") {
        const session = await getServerAuthSession({ req, res });

        if (!session?.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { data, error } = await supabase.rpc("get_my_forums", {
            input_user_id: session.user.id,
        })

        if (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data satisfies Forum[]);


    }
    res.status(405).json({ error: "Method not allowed" });
}

export default handler;