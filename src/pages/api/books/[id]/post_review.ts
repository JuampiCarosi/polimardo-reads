import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const schema = z.object({
  review: z.string(),
  id: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { review } = req.body;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const parseResult = schema.safeParse({ review, id });

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error });
  }

  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { error } = await supabase.from("book_reviews").insert({
    book_id: parseResult.data.id,
    author: session.user.id,
    review_text: parseResult.data.review,
  });

  if (error) {
    return res.status(500).json({ error: "Error adding review" });
  }

  const { data: bookLibrary, error: bookError } = await supabase
    .from("books_library")
    .select("*")
    .eq("book_id", parseResult.data.id)
    .eq("user_id", session.user.id);

  if (bookError) {
    console.error(bookError);
    res.status(500).json({
      error:
        bookError.message ?? "Unexpected error happend updating book status",
    });
    return;
  }

  if (bookLibrary.length === 0) {
    const { data: updatedStatusData, error } = await supabase
      .from("books_library")
      .upsert(
        {
          user_id: session.user.id,
          book_id: parseResult.data.id,
          status: "read",
        },
        { onConflict: "user_id, book_id" },
      )
      .select("*");

    if (error || !updatedStatusData) {
      console.error(error);
      res.status(500).json({
        error:
          error?.message ?? "Unexpected error happend updating book status",
      });
      return;
    }
    return res
      .status(200)
      .json({ message: "Review added", added_to_library: true });
  }

  return res
    .status(200)
    .json({ message: "Review added", added_to_library: false });
};

export default handler;
