import { getServerAuthSession } from "@/server/auth";
import { groupNotification } from "@/server/push-notification";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const schema = z.object({
  comment: z.string(),
  discussionId: z.string(),
  groupId: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const { discussionId, id } = req.query;

    const parseResult = schema.safeParse({
      ...req.body,
      discussionId,
      groupId: id,
    });

    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error });
    }

    const session = await getServerAuthSession({ req, res });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { error } = await supabase.from("discussion_comments").insert({
      discussion_id: parseResult.data.discussionId,
      created_by: session.user.id,
      comment: parseResult.data.comment,
    });

    if (error) {
      return res.status(500).json({ error: "Error adding comment" });
    }

    const { error: notificationErr } = await groupNotification({
      title: `${session.user.name} ha comentado en una discusión`,
      url: `/grupos/${parseResult.data.groupId}/discusiones/${parseResult.data.discussionId}`,
      groupId: parseResult.data.groupId,
      excludeUser: session.user.id,
    });

    if (notificationErr) {
      console.error(notificationErr);
    }

    return res.status(200).json({ message: "Comment added" });
  }
  return res.status(405).json({ error: "Method not allowed" });
};

export default handler;
