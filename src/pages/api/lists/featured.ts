import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { type ListDetailed } from "./[id]";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const session = await getServerAuthSession({ req, res });
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase.rpc("get_popular_list");

    if (error) {
      console.log("error 1", error);
      return res.status(500).json({ error: error.message });
    }

    const list = data[0];
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    const { data: books, error: error2 } = await supabase.rpc(
      "get_list_books",
      {
        input_list_id: list.id,
        input_user_id: session.user.id,
      },
    );

    if (error2) {
      console.log("error2", error2);
      return res.status(500).json({ error: error2.message });
    }

    res.status(200).json({
      ...list,
      books: books ?? [],
    } satisfies ListDetailed);
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};

export default handler;
