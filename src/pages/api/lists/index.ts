import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";

import { z } from "zod";

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  genres: z.string().array(),
});

const getSchema = z.object({
  search: z.string(),
});

interface List {
  id: string;
  name: string;
  description: string;
  created_by: string;
  genres: string[];
  books_count: number;
  voters_count: number;
  covers: string[];
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const result = postSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const list = result.data;
    const list_creator_session = await getServerAuthSession({ req, res });
    const list_creator = list_creator_session?.user.id;

    if (!list_creator) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase
      .from("lists")
      .insert({
        name: list.title,
        description: list.description,
        created_by: list_creator,
      })
      .select("id");

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    const id = data[0]?.id;
    if (!id) {
      return res.status(500).json({ error: "No id returned" });
    }

    const promies = result.data.genres.map(async (genre) => {
      const { error } = await supabase.from("lists_tags").insert({
        list_id: id,
        genre_id: genre,
      });

      if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }
    });

    await Promise.all(promies);

    res.status(201).json(data);
    return;
  }

  if (req.method === "GET") {
    const search = getSchema.safeParse(req.query);

    if (!search.success) {
      return res.status(400).json({ error: search.error });
    }

    const { data, error } = await supabase.rpc("get_similar_lists", {
      search_input: search.data.search,
    });
    console.log(data);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(
      data.map((d) => ({
        ...d,
        covers: [...new Set(d.covers)].slice(0, 5),
        genres: [...new Set(d.genres)],
      })) satisfies List[],
    );
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};

export default handler;
export type { List };
