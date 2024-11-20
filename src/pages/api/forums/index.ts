import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";


export type Forum = {
    id: string;
    name: string;
    discussions_count: number;
    status: boolean;
}

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "GET") {
        const session = await getServerAuthSession({ req, res });

        if (!session?.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const {data, error} = await supabase.rpc("get_my_forums", {
            input_user_id: session.user.id,
        })

        if(error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data satisfies Forum[]);


    }
    res.status(405).json({ error: "Method not allowed" });
}

export default handler;