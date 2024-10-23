import { supabase, authDB } from "@/server/supabase";
import { type Database } from "@/types/supabase";

export const createUser = async (
  user: Database["next_auth"]["Tables"]["users"]["Insert"],
  favoriteGenres: Array<Database["public"]["Tables"]["books_genres"]["Row"]>,
) => {
  const { data, error } = await authDB.from("users").insert(user).select();
  if (error) {
    throw Error(error.message);
  }
  const createdUser = data[0]!;

  favoriteGenres.forEach((genre) => {
    supabase
      .from("user_favorite_genres")
      .insert({ genre_id: genre.id, user_id: createdUser.id })
      .then((res) => console.log("res: ", res));
  });
};
