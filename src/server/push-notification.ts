import { supabase } from "./supabase";

export function pushNotification({
  title,
  url,
  users,
}: {
  title: string;
  url: string;
  users: string[];
}) {
  const notifications = users.map((user) => ({
    user_id: user,
    title,
    url,
    is_read: false,
  }));

  return supabase.from("notifications").insert(notifications);
}
