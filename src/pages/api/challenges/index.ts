import { supabase } from "@/server/supabase";
import { NextApiHandler } from "next";
import { promise, z } from "zod";

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  createdBy: z.string(),
  books: z.array(z.string()).min(1),
});

const UserIdSchema = z.object({
  user: z.string(),
});

export type MyChallenges = {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  created_by: string;
  participants: number;
  book_ids: string[];
  books_read: string[];
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const result = postSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const challengeCreationData = {
      name: result.data.title,
      description: result.data.description,
      start_date: result.data.startDate,
      end_date: result.data.endDate,
      created_by: result.data.createdBy,
    };

    const books = result.data.books;

    const { data, error } = await supabase
      .from("challenges")
      .insert(challengeCreationData)
      .select("id");

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    const challengeId: string | undefined = data[0]?.id;

    if (!challengeId) {
      return res.status(500).json({ error: "No id returned" });
    }

    const promise = books.map(async (book) => {
      const { data, error } = await supabase.from("challenges_books").insert({
        challenge_id: challengeId,
        book_id: book,
      });
      if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }
    });

    await Promise.all(promise);

    res.status(201).json(data);
  }

  if (req.method === "GET") {
    const schema = UserIdSchema.safeParse(req.query);

    if (!schema.success) {
      return res.status(400).json({ error: "No id provided" });
    }

    const id = schema.data.user;

    const result = await supabase.rpc("get_user_challenges", {
      user_challenge_id: id,
    });

    if (result.error) {
      console.error(result.error);
      return res.status(500).json({ error: result.error.message });
    }

    res.status(200).json(result.data satisfies MyChallenges[]);
  }
};

export default handler;
