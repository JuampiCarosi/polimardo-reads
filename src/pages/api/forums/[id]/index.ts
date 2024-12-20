import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { NextApiHandler } from "next";
import { z } from "zod";

export type ForumInfo = {
    id: string;
    name: string | null;
    status: boolean;
    created_by: string;
    discussions: Array<{
      created_at: string;
      created_by: string | null;
      description: string | null;
      group_id: string;
      id: string;
      title: string;
      comments_count: number;
    }> | null;
  };


const handler: NextApiHandler = async (req, res) => {
    if (req.method === "GET") {
        const session = await getServerAuthSession({ req, res });

        if (!session?.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { id } = req.query;
        const parseResult = z.string().safeParse(id);
        if (!parseResult.success) {
            return res.status(400).json({ error: parseResult.error });
        }

        const { data, error } = await supabase.rpc("get_forum_info", {
            input_forum_id: parseResult.data,
        });

        if (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({
            ...data[0],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            discussions: (data[0]?.discussions as unknown[])?.filter(
                (d) => d !== null,
            ),
        } as ForumInfo);
        return;

    
    }
};

export default handler;