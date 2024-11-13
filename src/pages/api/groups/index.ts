import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

export type Group = {
  id: string;
  title: string;
  member_count: number;
  discussions_count: number;
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const session = await getServerAuthSession({ req, res });

    if (!session?.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase.rpc("get_groups", {
      input_user_id: session.user.id,
    });

    if (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data satisfies Group[]);
    return;
  }

  if (req.method === "POST") {
    const session = await getServerAuthSession({ req, res });

    if (!session?.user.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parseResult = z
      .object({ title: z.string(), members: z.string().array() })
      .safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error });
      return;
    }

    const { data, error } = await supabase
      .from("groups")
      .insert({
        title: parseResult.data.title,
        created_by: session.user.id,
      })
      .select("id");

    const id = data?.[0]?.id;
    if (error || !id) {
      console.log(error);
      res.status(500).json({ error: error?.message ?? "Error creando grupo" });
      return;
    }

    const { error: errorMember } = await supabase.from("group_members").insert({
      group_id: id,
      user_id: session.user.id,
      has_accepted: true,
    });

    if (errorMember) {
      console.log(errorMember);
      res.status(500).json({ errorMember: errorMember.message });
      return;
    }

    for (const member of parseResult.data.members) {
      const { error } = await supabase.from("group_members").insert({
        group_id: id,
        user_id: member,
        has_accepted: false,
      });

      if (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
        return;
      }
    }

    res.status(201).json({ id });
    return;
  }
};

export default handler;
