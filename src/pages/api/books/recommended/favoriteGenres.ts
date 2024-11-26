import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getCoverBlob, type BookRaw } from "../[id]";

export type BookWithBlob = BookRaw & { cover_blob?: string };

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

  const { error: countError, count } = await supabase
    .from("book_genres")
    .select("genre_id", { count: "exact" })
    .in("genre_id", genreIds);

  if (countError) {
    console.error(countError);
    res.status(500).json({ error: countError.message });
    return;
  }

  const recommendedAmount = 5;
  const randomRange = Math.floor(
    Math.random() * (count ?? 0 - recommendedAmount),
  );

  const { data: bookIdsData, error: bookIdsError } = await supabase
    .from("book_genres")
    .select("book_id")
    .in("genre_id", genreIds)
    .range(randomRange, randomRange + recommendedAmount);

  if (bookIdsError || !bookIdsData) {
    console.error(bookIdsError);
    return res.status(500).json({ error: bookIdsError.message });
  }

  const bookIds = bookIdsData.map((book) => book.book_id);

  const { data, error } = await supabase
    .from("books_detailed")
    .select("*, books_library(status, user_id)")
    .eq("books_library.user_id", userId)
    .in("id", bookIds);

  if (error || !data) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  const promises = data
    .filter((b) => b.books_library.length === 0)
    .map(async (book) => {
      return {
        ...book,
        cover_blob: await getCoverBlob(book),
        genres: book.genres.replace(/[\[\]']/g, "").split(","),
      };
    });
  const books = await Promise.all(promises);

  res.status(200).json(books satisfies BookWithBlob[]);
}
