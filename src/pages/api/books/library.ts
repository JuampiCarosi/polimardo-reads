import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type BookWithStatus } from "./[id]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabase
    .from("books_library")
    .select("status, books_detailed(*)")
    .eq("user_id", session.user.id);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  const books = data
    .filter((b) => b.books_detailed !== null)
    .map(({ books_detailed, status }) => ({
      status,
      ...books_detailed!,
    }));

  res.status(200).json(books satisfies BookWithStatus[]);
}
