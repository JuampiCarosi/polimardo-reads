import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiHandler } from "next";

export type Friendship = {
  id: string;
  friend_id: string;
  friend_name: string;
  friend_email: string;
  friend_image: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_image: string;
  is_added: boolean;
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const session = await getServerAuthSession({ req, res });

    if (!session?.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase.rpc("get_friends_data", {
      input_user_id: session.user.id,
    });

    if (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }


    res.status(200).json(data satisfies Friendship[]);
    return;
  }
};

export default handler;
