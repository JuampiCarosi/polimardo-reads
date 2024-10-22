import { env } from "@/env";
import { type Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
);

export const authDB = createClient<Omit<Database, "public">>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: {
      schema: "next_auth",
    },
  },
);
