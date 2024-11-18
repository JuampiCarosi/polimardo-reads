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

export async function groupNotification({
  title,
  url,
  groupId,
  excludeUser,
}: {
  title: string;
  url: string;
  groupId: string;
  excludeUser?: string;
}) {
  const { data, error } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  if (error) {
    return { data: null, error };
  }

  const filteredUsers = data
    .filter((user) => user.user_id !== excludeUser)
    .map((user) => user.user_id);

  return pushNotification({ title, url, users: filteredUsers });
}
