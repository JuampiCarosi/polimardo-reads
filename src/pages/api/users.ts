import { supabase, authDB } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const userSchema = z.object({
  email: z.string(),
  birth_date: z.string(),
  country: z.string(),
  gender: z.string(),
  name: z.string(),
});

const favoriteGenresSchema = z.array(
  z.object({ id: z.string(), name: z.string() }),
);

const handler: NextApiHandler = async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const user = userSchema.parse(req.body.user as never);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const genres = favoriteGenresSchema.parse(req.body.favoriteGenres);

  const { data, error } = await authDB
    .from("users")
    .update({ ...user, onboarding_completed: true })
    .eq("email", user.email)
    .select();

  if (error) {
    throw Error(error.message);
  }
  const createdUser = data[0];

  genres.forEach((genre) => {
    supabase
      .from("user_favorite_genres")
      .insert({ genre_id: genre.id, user_id: createdUser.id })
      .then();
  });

  res.status(201).json(user);
};

export default handler;
export {userSchema};
