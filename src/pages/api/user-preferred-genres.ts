import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

export type Genres = {
  id: string;
  name: string;
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const schema = z.object({
    id: z.string(),
  });
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const userId = result.data.id;

  const { data: favoriteGenresId, error: favoriteGenresIdError } =
    await supabase
      .from("user_favorite_genres")
      .select("genre_id")
      .eq("user_id", userId);

  if (favoriteGenresIdError || !favoriteGenresId) {
    console.error(favoriteGenresIdError);
    return res.status(500).json({ error: favoriteGenresIdError.message });
  }

  const { data: favoriteGenres, error: favoriteGenresError } = await supabase
    .from("genres")
    .select("*")
    .in(
      "id",
      favoriteGenresId.map((genre) => genre.genre_id),
    );

  if (favoriteGenresError || !favoriteGenres) {
    console.error(favoriteGenresError);
    return res.status(500).json({ error: favoriteGenresError.message });
  }

  res.status(200).json(favoriteGenres satisfies Genres[]);
};

export default handler;
