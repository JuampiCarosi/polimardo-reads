import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";
import { type User } from "../../users";

export type GroupInfo = {
  id: string;
  title: string | null;
  members: Array<User & { has_accepted: boolean }> | null;
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

    const { data, error } = await supabase.rpc("get_group_info", {
      input_group_id: parseResult.data,
    });

    if (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({
      ...data[0],
      members: (data[0]?.members as unknown[])?.filter((m) => m !== null),
      discussions: (data[0]?.discussions as unknown[])?.filter(
        (d) => d !== null,
      ),
    } as GroupInfo);
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};

export default handler;
