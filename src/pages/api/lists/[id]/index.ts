import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";
import { getServerAuthSession } from "@/server/auth";

export type ListDetailed = {
  id: string;
  name: string;
  description: string;
  genres: string[];
  books_count: number;
  users_count: number;
  votes_count: number;
  books: Array<{
    id: string;
    title: string;
    series: string;
    author: string;
    description: string;
    avg_rating: number;
    self_rating: number;
    cover_img: string;
    book_votes: number;
    self_voted: number;
  }>;
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const { id } = req.query;

    const parseResult = z.string().safeParse(id);
    const session = await getServerAuthSession({ req, res });

    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error });
    }
    const listId = parseResult.data;

    const listInfoPromise = supabase.rpc("get_list_info", {
      input_list_id: listId,
    });

    const listBooksPromise = supabase.rpc("get_list_books", {
      input_list_id: listId,
      input_user_id: session.user.id,
    });

    const [listInfo, listBooks] = await Promise.all([
      listInfoPromise,
      listBooksPromise,
    ]);

    const listInfoData = listInfo.data?.[0];

    if (listInfo.error) {
      console.log("LISTINFO", listInfo.error);
      res.status(500).json({ error: listInfo.error.message });
      return;
    }
    if (!listInfoData) {
      res.status(404).json({ error: "List not found" });
      return;
    }

    if (listBooks.error) {
      console.log("LISTBOOKS", listBooks.error);
      res.status(500).json({ error: listBooks.error.message });
      return;
    }

    const list: ListDetailed = {
      ...listInfoData,
      books: listBooks.data,
      genres: [...new Set(listInfoData.genres)],
    };

    res.status(200).json(list);
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};

export default handler;
