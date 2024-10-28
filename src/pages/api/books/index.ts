import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";
import { type Book } from "./[id]";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { data, error, count, status } = await supabase
    .from("books_detailed")
    .select("*");

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
  console.log("COUNT", count);
  console.log("STATUS", status);

  res.status(200).json(data satisfies Book[]);
};

export default handler;
