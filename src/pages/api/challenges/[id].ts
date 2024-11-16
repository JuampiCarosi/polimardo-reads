import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

export type Challenge = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  start_date: string;
  end_date: string;
  participants: number;
  book_ids: string[];
};

const putSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdBy: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  books: z.array(z.string()),
});

async function addNewBooks(challenge_id: string, challengeBooks: string[], currentBooks: string[]) {

    const newBooks = challengeBooks.filter((book) => !currentBooks.includes(book));

    if (newBooks.length > 0) {
      const insertData = newBooks.map((book) => ({
        challenge_id: challenge_id,
        book_id: book,
      }));

      const { error: insertError } = await supabase.from("challenges_books").insert(insertData);

      if (insertError) {
        console.error(insertError);
        return false;
      }
    }
}

async function removeOldBooks(challenge_id: string, challengeBooks: string[], currentBooks: string[]) {
  const deleteBooks = currentBooks.filter((book) => !challengeBooks.includes(book));

    if (deleteBooks.length > 0) {
      const { error: deleteError } = await supabase.from("challenges_books").delete().eq("challenge_id", challenge_id).in("book_id", deleteBooks);

      if (deleteError) {
        console.error(deleteError);
        return false;
      }
    }
}

const handler: NextApiHandler = async (req, res) => {
  const challenge_id = req.query.id;

  if (typeof challenge_id !== "string") {
    return res.status(400).json({ error: "Invalid challenge id" });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase.rpc("get_challenge", {
      challenge_id,
    });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    if (!data?.[0]) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    return res.status(200).json(data[0] satisfies Challenge);
  }

  if (req.method === "PUT") {
    const result = putSchema.safeParse(req.body);
    if (!result.success) {
      console.log(result.error.message);
      return res.status(400).json({ error: result.error });
    }

    const challengeData = {
      id: result.data.id,
      name: result.data.name,
      description: result.data.description,
      created_by: result.data.createdBy,
      start_date: result.data.startDate,
      end_date: result.data.endDate,
    };

    const { data, error } = await supabase.from("challenges").upsert(challengeData).eq("id", challenge_id);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    const challengeBooks = result.data.books;
    const { data: bookData, error: bookError } = await supabase.from("challenges_books").select("*").eq("challenge_id", challenge_id);

    if (bookError) {
      console.error(bookError);
      return res.status(500).json({ error: bookError.message });
    }
    const currentBooks = bookData.map((book) => book.book_id);
  
    if (!await addNewBooks(challenge_id, challengeBooks, currentBooks)) {
      console.error("Error adding books");
      return res.status(500).json({ error: "Error adding books" });
    }
    
    if (!await removeOldBooks(challenge_id, challengeBooks, currentBooks)) {
      console.error("Error removing books");
      return res.status(500).json({ error: "Error removing books" });
    }

    if (!data?.[0]) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    return res.status(200).json(data[0] satisfies Challenge);
  }
};

export default handler;
