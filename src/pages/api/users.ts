import { supabase, authDB } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const userSchema = z.object({
  email: z.string(),
  birth_date: z.string(),
  country: z.string(),
  gender: z.string(),
  name: z.string(),
  role: z.string(),
});

interface User {
  birth_date: string | null;
  country: string | null;
  email: string | null;
  emailVerified: string | null;
  gender: string | null;
  id: string;
  image: string | null;
  name: string | null;
  onboarding_completed: boolean;
  role: string | null;
}

const favoriteGenresSchema = z.array(
  z.object({ id: z.string(), name: z.string() }),
);

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
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
    const createdUser = data[0]!;

    genres.forEach((genre) => {
      supabase
        .from("user_favorite_genres")
        .insert({ genre_id: genre.id, user_id: createdUser.id })
        .then();
    });

    res.status(201).json(user);
    return;
  }

  if (req.method === "PUT") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = userSchema.parse(req.body.user);

    const { data, error } = await authDB
      .from("users")
      .update({ ...user })
      .eq("email", user.email)
      .select();

    if (error) {
      throw Error(error.message);
    }

    const updatedUser = data[0]!;
    res.status(201).json(updatedUser);
    return;
  }

  if (req.method === "GET") {
    const userId = req.query.id as string | undefined;

    if (userId) {
      const { data, error } = await authDB
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json(data);
      return;
    }

    const { data, error } = await authDB.from("users").select("*");

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};

export default handler;
export type { User };
