import { getServerAuthSession } from "@/server/auth";
import { groupNotification } from "@/server/push-notification";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  group_id: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const parseResult = schema.safeParse(req.body);
    const session = await getServerAuthSession({ req, res });

    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!parseResult.success) {
      console.log(parseResult.error);
      return res.status(400).json({ error: parseResult.error });
    }

    const { error } = await supabase
      .from("group_discussions")
      .insert({ ...parseResult.data, created_by: session.user.id });

    if (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }

    const { error: notificationErr } = await groupNotification({
      title: `${session.user.name} ha creado una discusión`,
      url: `/grupos/${parseResult.data.group_id}`,
      groupId: parseResult.data.group_id,
      excludeUser: session.user.id,
    });

    if (notificationErr) {
      console.error(notificationErr);
    }

    res.status(200).json({ message: "Discussion created" });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};

export default handler;
