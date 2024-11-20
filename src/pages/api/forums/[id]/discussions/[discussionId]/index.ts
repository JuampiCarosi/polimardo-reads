import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

export type Discussion = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_name: string;
  comments: Array<{
    id: string;
    created_at: string;
    user_id: string;
    discussion_id: string;
    comment: string;
    user_name: string;
    user_img: string;
  }>;
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const parseResult = z.string().safeParse(req.query.discussionId);
    const session = await getServerAuthSession({ req, res });

    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error });
    }
    const discussionId = parseResult.data;

    const discussionInfoPromise = supabase.rpc("get_discussion_info", {
      input_discussion_id: discussionId,
    });

    const commentsPromise = supabase.rpc("get_discussion_comments", {
      input_discussion_id: discussionId,
    });

    const [discussionInfo, comments] = await Promise.all([
      discussionInfoPromise,
      commentsPromise,
    ]);

    const discussionInfoData = discussionInfo.data?.[0];

    if (discussionInfo.error) {
      console.log("discussionINFO", discussionInfo.error);
      res.status(500).json({ error: discussionInfo.error.message });
      return;
    }
    if (!discussionInfoData) {
      res.status(404).json({ error: "discussion not found" });
      return;
    }

    if (comments.error) {
      console.log("COMMENTS", comments.error);
      res.status(500).json({ error: comments.error.message });
      return;
    }

    const discussion: Discussion = {
      id: discussionInfoData.id,
      title: discussionInfoData.title,
      description: discussionInfoData.description,
      created_at: discussionInfoData.created_at,
      user_name: discussionInfoData.user_name,
      comments: comments.data,
    };

    res.status(200).json(discussion);
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};

export default handler;
