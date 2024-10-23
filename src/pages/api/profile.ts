import { supabase, authDB } from "@/server/supabase";
import { type NextApiHandler } from "next";
import {userSchema} from "@/pages/api/users";
import { json } from "stream/consumers";

const handler: NextApiHandler = async (req, res) => {

  if (req.method !== "PUT")
    return res.status(405).json({ error: "Method not allowed" });

  const user = userSchema.parse(req.body.user as never);

  const { data, error } = await authDB
        .from("users")
        .update({ ...user } as any)
        .eq("email", user.email)
        .select();

  if (error) {
      throw Error(error.message);
  }
  const updatedUser = data[0]!;
  res.status(201).json(updatedUser);
};

export default handler;