import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import type { NextApiHandler } from "next";

export type Invitation = {
    id: string;
    group_id: string;
    title: string;
    member_count: number;
    discussions_count: number;
}

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "GET") {
      const session = await getServerAuthSession({ req, res });
  
      if (!session?.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const { data, error } = await supabase.rpc("get_user_group_invites", {
        input_user_id: session.user.id,
      });
  
      if (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
      }
  
      res.status(200).json(data satisfies Invitation[]);
      return;
    }
}

export default handler;