import { supabase } from "@/server/supabase";
import { NextApiHandler } from "next";
import { z } from "zod";

const schema = z.object({
    status: z.boolean(),

});

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "PATCH"){
        const parseResult = schema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: parseResult.error });
        }
        const { status } = parseResult.data;
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: "id is required" });
        }
        const { data, error } = await supabase
            .from("forums")
            .update({ status })
            .eq("id", id)
            .select("id");

        if (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data[0]);
        return;



    }
}

export default handler;