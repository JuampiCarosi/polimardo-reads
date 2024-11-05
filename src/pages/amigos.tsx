import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useQuery } from "react-query";
import { User } from "./api/users";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { FriendshipRaw } from "./api/friendships";
import { Separator } from "@/components/ui/separator";

export default function Component() {
  const session = useSession();

  const all_users = useQuery<User[]>({
    queryKey: ["users"],
  });

  const possible_friendships = useQuery<FriendshipRaw[]>({
    queryKey: ["friendships"],
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filtered_contacts =
    all_users.data?.filter((user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const distinct_users = filtered_contacts.filter(
    (user) =>
      user.id !== session.data?.user.id &&
      !possible_friendships.data?.find(
        (friendship) =>
          friendship.friend_id === user.id || friendship.user_id === user.id,
      ),
  );

  const sendFriendRequest = async (id: string) => {
    const response = await fetch("/api/friendships", {
      method: "POST",
      body: JSON.stringify({ user_id: session.data?.user.id, friend_id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    possible_friendships.refetch();

    if (!response.ok) {
      toast.error("Error mandando solicitud de amistad");
      console.error(await response.json());
      return;
    }

    toast.success("Solicitud de amistad enviada");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="position-relative mx-auto mt-14 items-center">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Agregar Amigos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
              <Input
                placeholder="Buscar nuevos amigos"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              {distinct_users.map((user, index) => (
                <>
                  <div
                    key={user.id}
                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg p-2"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback>
                          {(user.name ?? "NA").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => sendFriendRequest(user.id)}
                    >
                      Add
                    </Button>
                  </div>
                  {index != distinct_users.length - 1 ? (
                    <Separator></Separator>
                  ) : null}
                </>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
