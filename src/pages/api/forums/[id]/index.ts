import { NextApiHandler } from "next";

export type ForumInfo = {
    id: string;
    title: string | null;
    discussions: Array<{
      created_at: string;
      created_by: string | null;
      description: string | null;
      group_id: string;
      id: string;
      title: string;
      comments_count: number;
    }> | null;
  };


const handler: NextApiHandler = async (req, res) => {
    
    
    }

export default handler;