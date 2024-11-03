import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const voteSchema = z.object({
  listId: z.string(),
  bookId: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const body = voteSchema.safeParse(await req.body);

    const session = await getServerAuthSession({ req, res });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!body.success) {
      return res.status(400).json({ error: body.error });
    }

    const { listId, bookId } = body.data;

    const { error } = await supabase.from("lists_votes").upsert(
      {
        list_id: listId,
        book_id: bookId,
        user_id: session.user.id,
      },
      {
        ignoreDuplicates: true,
      },
    );

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: "Voted successfully" });
  }

  if (req.method === "DELETE") {
    const body = voteSchema.safeParse(await req.body);

    const session = await getServerAuthSession({ req, res });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!body.success) {
      return res.status(400).json({ error: body.error });
    }

    const { listId, bookId } = body.data;

    const { error } = await supabase
      .from("lists_votes")
      .delete()
      .eq("list_id", listId)
      .eq("book_id", bookId)
      .eq("user_id", session.user.id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: "Voted removed successfully" });
  }
};

export default handler;
