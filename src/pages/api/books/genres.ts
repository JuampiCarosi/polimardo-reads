import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";

export type Genres = {
  id: string;
  name: string;
};

const mainGenres = [
  "Art",
  "Biography",
  "Business",
  "Chick Lit",
  "Childrens",
  "Christian",
  "Classics",
  "Comics",
  "Contemporary",
  "Cookbooks",
  "Crime",
  "Fantasy",
  "Fiction",
  "Gay",
  "Graphic Novels",
  "Historical Fiction",
  "History",
  "Horror",
  "Humor",
  "Comedy",
  "Manga",
  "Memoir",
  "Music",
  "Mystery",
  "Nonfiction",
  "Paranormal",
  "Philosophy",
  "Poetry",
  "Psychology",
  "Religion",
  "Romance",
  "Science",
  "Science Fiction",
  "Self Help",
  "Suspense",
  "Spirituality",
  "Sports",
  "Thriller",
  "Travel",
  "Young Adult",
];

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { data, error } = await supabase
    .from("genres")
    .select("*")
    .in("name", mainGenres);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data satisfies Genres[]);
};

export default handler;
