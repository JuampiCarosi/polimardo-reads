import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { data, error } = await supabase.from("test").select("*");

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

export default handler;
