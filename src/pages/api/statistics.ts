import { getServerAuthSession } from "@/server/auth";
import { supabase } from "@/server/supabase";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") {
        
    const session = await getServerAuthSession({ req, res });
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase
        .from("books_library")
        .select("status, created_at")
        .eq("user_id", session.user.id)

    if (error) { 
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    const books = data;

    const booksPerMonth = [
        { month: "Jan", books: 0 },
        { month: "Feb", books: 0 },
        { month: "Mar", books: 0 },
        { month: "Apr", books: 0 },
        { month: "May", books: 0 },
        { month: "Jun", books: 0 },
        { month: "Jul", books: 0 },
        { month: "Aug", books: 0 },
        { month: "Sep", books: 0 },
        { month: "Oct", books: 0 },
        { month: "Nov", books: 0 },
        { month: "Dec", books: 0 },
    ];
    
    books.forEach((book) => {
        const month = new Date(book.created_at).toLocaleString('default', { month: 'short' });
        const monthIndex = booksPerMonth.findIndex((data) => data.month === month);
        if (booksPerMonth[monthIndex])
            booksPerMonth[monthIndex].books += 1;
    });
    

    res.status(200).json( booksPerMonth );
    return;
    }

    return res.status(405).json({ error: "Method not allowed" });
  }
