import { getServerAuthSession } from "@/server/auth";
import { pushNotification } from "@/server/push-notification";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "PUT") {
    const session = await getServerAuthSession({ req, res });

    if (!session?.user.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parseResult = z
      .object({ members: z.string().array() })
      .safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error });
      return;
    }

    const parsedId = z.string().safeParse(req.query.id);
    if (!parsedId.success) {
      res.status(400).json({ error: parsedId.error });
      return;
    }

    for (const member of parseResult.data.members) {
      const { error } = await supabase.from("group_members").insert({
        group_id: parsedId.data,
        user_id: member,
        has_accepted: false,
      });

      if (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
        return;
      }
    }

    const { data: group, error: errorGroup } = await supabase
      .from("groups")
      .select("title")
      .eq("id", parsedId.data)
      .single();

    if (!errorGroup) {
      const { error: notificationError } = await pushNotification({
        title: `${session.user.name} te invitó al grupo ${group.title}!`,
        users: parseResult.data.members,
        url: `/grupos/invitaciones`,
      });

      if (notificationError) {
        console.log(notificationError);
        res.status(500).json({ error: notificationError.message });
        return;
      }
    }

    res.status(201).json({ success: true });
    return;
  }
};

export default handler;
