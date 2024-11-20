import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { z } from "zod";

const schema = z.object({
        id: z.string(),
    });

const handler: NextApiHandler = async (req, res) => {
    
  if (req.method === "GET") {

    const result = schema.safeParse(req.query);

    if (!result.success)
        return res.status(400).json({ error: result.error });

    const session = await getServerAuthSession({ req, res });

    if (!session)
        return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabase
    .from("books_library")
    .select("status")
    .eq("user_id", result.data.id)

    
    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    const readBooks = data.filter((book) => book.status === "read");

    res.status(200).json(readBooks.length);
    return;
  }
  res.status(405).json({ error: "Method not allowed" });
  return;
};

export default handler;