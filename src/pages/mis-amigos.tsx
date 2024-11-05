import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useQuery } from "react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Friendship } from "./api/mis-amigos";

export default function Component() {
  const session = useSession();

  const possible_friends = useQuery<Friendship[]>({
    queryKey: ["mis-amigos"],
  });

  const user_id = session.data?.user.id;

  const friends = possible_friends.data?.filter(
    (friend) =>
      friend.is_added &&
      (friend.user_id === user_id || friend.friend_id === user_id),
  );

  const pending_friends = possible_friends.data?.filter(
    (friend) => friend.user_id === session.data?.user.id && !friend.is_added,
  );

  const friend_requests = possible_friends.data?.filter(
    (friend) => friend.friend_id === session.data?.user.id && !friend.is_added,
  );

  const handleAddFriend = async (id: string, friend_id: string) => {
    const response = await fetch("/api/friends", {
      method: "PATCH",
      body: JSON.stringify({
        id: id,
        user_id: friend_id,
        friend_id: user_id,
        is_added: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    possible_friends.refetch();

    if (!response.ok) {
      toast.error("Ocurrio un error al agregar al amigo");
      console.error(await response.json());
      return;
    }

    toast.success("Amigo agregado correctamente");
  };

  const handleDeleteFriend = async (id: string) => {
    console.log(id);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="position-relative mx-auto mt-14 items-center">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Administra tus Amigos!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Amigos</h2>
            </div>
            {friends?.map((friend, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={friend.friend_image} />
                </Avatar>
                <span>
                  {friend.user_id !== user_id
                    ? friend.user_name
                    : friend.friend_name}
                </span>
                <Button
                  className="ml-4 flex-shrink-0"
                  size="sm"
                  onClick={() => handleDeleteFriend(friend.id)}
                >
                  Eliminar Amigo
                </Button>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Solicitudes de Amistad</h2>
            </div>
            {friend_requests?.map((friendship, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={friendship.user_image} />
                </Avatar>
                <span>{friendship.user_name}</span>
                <Button
                  size="sm"
                  onClick={() =>
                    handleAddFriend(friendship.id, friendship.friend_id)
                  }
                >
                  Aceptar
                </Button>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Solicitudes Pendientes</h2>
            </div>
            {pending_friends?.map((friend, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={friend.friend_image} />
                </Avatar>
                <span>{friend.friend_name}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
