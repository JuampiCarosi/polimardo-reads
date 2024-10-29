import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

export type BookRaw = {
  author: string;
  cover_img: string | null;
  description: string;
  edition: string | null;
  genres: string;
  id: string;
  isbn: string;
  language: string;
  publish_year: number | null;
  publisher: string | null;
  series: string;
  title: string;
};

export type Book = BookRaw & {
  status: "reading" | "read" | "wantToRead" | null;
  selfRating: number | null;
};

const schema = z.object({
  id: z.string(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabase
    .from("books_detailed")
    .select("*, books_library(status), books_ratings(rating)")
    .eq("id", result.data.id)
    .eq("books_library.user_id", session.user.id);

  if (error || !data) {
    console.error(error);
    return res.status(500).json({
      error: error?.message ?? "Unexpected error happend fetching book",
    });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: "Book not found" });
  }

  const book = {
    ...data[0]!,
    status: data[0]?.books_library[0]?.status ?? null,
    selfRating: data[0]?.books_ratings[0]?.rating ?? null,
  };

  res.status(200).json(book satisfies Book);
};

export default handler;
