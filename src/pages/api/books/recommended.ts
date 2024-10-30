import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type Book } from "./[id]";

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

  const userId = session.user.id;

  const { data: favoriteGenres, error: favoriteGenresError } = await supabase
    .from("user_favorite_genres")
    .select("genre_id")
    .eq("user_id", userId);

  if (favoriteGenresError || !favoriteGenres) {
    console.error(favoriteGenresError);
    return res.status(500).json({ error: favoriteGenresError.message });
  }

  const genreIds = favoriteGenres.map((genre) => genre.genre_id);

  console.log(genreIds);

  const { data: bookIdsData, error: bookIdsError } = await supabase
    .from("book_genres")
    .select("book_id")
    .in("genre_id", genreIds)
    .limit(20);

  if (bookIdsError || !bookIdsData) {
    console.error(bookIdsError);
    return res.status(500).json({ error: bookIdsError.message });
  }
  
  const bookIds = bookIdsData.map((book) => book.book_id);
  
  console.log(bookIds);

  const { data, error } = await supabase
    .from("books_detailed")
    .select("*")
    .in("id", bookIds);

  if (error || !data) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  const books = data.map((book) => ({
    ...book,
  }));

  res.status(200).json(books);
}
