import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useQuery } from "react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { type Friendship } from "./api/myFriends";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";

export default function Component() {
  const session = useSession();
  const router = useRouter();

  const userId = session.data?.user.id;
  const possibleFriendships = useQuery<Friendship[]>({
    queryKey: ["myFriends"],
  });

  console.log(possibleFriendships.data);

  const addedFriends = possibleFriendships.data?.filter(
    (friend) =>
      friend.is_added &&
      (friend.user_id === userId || friend.friend_id === userId),
  );

  const pendingFriends = possibleFriendships.data?.filter(
    (friend) => friend.user_id === session.data?.user.id && !friend.is_added,
  );

  const friendRequests = possibleFriendships.data?.filter(
    (friend) => friend.friend_id === session.data?.user.id && !friend.is_added,
  );

  const handleAddFriend = async (id: string) => {
    const response = await fetch("/api/friendships", {
      method: "PATCH",
      body: JSON.stringify({
        id: id,
        is_added: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    void possibleFriendships.refetch();

    if (!response.ok) {
      toast.error("Ocurrio un error al agregar al amigo");
      console.error(await response.json());
      return;
    }

    toast.success("Amigo agregado correctamente");
  };

  const handleDeleteFriend = async (id: string) => {
    const response = await fetch("/api/friendships", {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    void possibleFriendships.refetch();

    if (!response.ok) {
      toast.error("Error eliminando amigo");
      console.error(await response.json());
      return;
    }

    toast.success("Amigo eliminado correctamente");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="position-relative mx-auto mt-14 items-center">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Administra tus Amigos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="pb-2 text-lg font-semibold">Amigos</h2>
              </div>
              {addedFriends?.length === 0 && (
                <div className="text-sm text-slate-500">
                  No tienes amigos actualmente {" - "}
                  <Link
                    className="text-blue-700 underline"
                    href={"/descubrir-amigos"}
                  >
                    Agrega nuevos amigos aqui!
                  </Link>
                </div>
              )}

              {addedFriends?.map((friend) => (
                <div
                  className="flex cursor-pointer items-center justify-between py-2 hover:bg-slate-50"
                  key={friend.id}
                  onClick={() =>
                    router.push(
                      `/perfil/${
                        friend.user_id !== userId
                          ? friend.user_id
                          : friend.friend_id
                      }`,
                    )
                  }
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={
                          friend.user_id !== userId
                            ? friend.user_image
                            : friend.friend_image
                        }
                        className="cursor-pointer"
                      />
                    </Avatar>
                    <span>
                      {friend.user_id !== userId
                        ? friend.user_name
                        : friend.friend_name}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteFriend(friend.id)}
                  >
                    Eliminar Amigo
                  </Button>
                </div>
              ))}
              <Separator />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="pb-2 text-lg font-semibold">
                  Solicitudes de Amistad
                </h2>
              </div>
              {friendRequests?.length === 0 && (
                <div className="text-sm text-slate-500">
                  No tienes solicitudes de amistad pendientes
                </div>
              )}

              {friendRequests?.map((friendship) => (
                <div
                  className="flex cursor-pointer items-center justify-between py-2 hover:bg-slate-50"
                  key={friendship.id}
                  onClick={() =>
                    router.push(
                      `/perfil/${
                        friendship.user_id !== userId
                          ? friendship.user_id
                          : friendship.friend_id
                      }`,
                    )
                  }
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={friendship.user_image} />
                    </Avatar>
                    <span>
                      {friendship.user_id !== userId
                        ? friendship.user_name
                        : friendship.friend_name}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteFriend(friendship.id)}
                    >
                      Rechazar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddFriend(friendship.id)}
                    >
                      Aceptar
                    </Button>
                  </div>
                </div>
              ))}
              <Separator className="mt-4" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="pb-2 text-lg font-semibold">
                  Solicitudes Pendientes
                </h2>
              </div>
              {pendingFriends?.length === 0 && (
                <div className="text-sm text-slate-500">
                  No tienes solicitudes de amistad enviadas pendientes
                </div>
              )}

              {pendingFriends?.map((friend) => (
                <div
                  className="flex cursor-pointer items-center justify-between py-2 hover:bg-slate-50"
                  key={friend.id}
                  onClick={() =>
                    router.push(
                      `/perfil/${
                        friend.user_id !== userId
                          ? friend.user_id
                          : friend.friend_id
                      }`,
                    )
                  }
                >
                  {" "}
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={friend.friend_image}
                        onClick={() =>
                          router.push(
                            `/perfil/${
                              friend.user_id !== userId
                                ? friend.user_id
                                : friend.friend_id
                            }`,
                          )
                        }
                        className="cursor-pointer"
                      />
                    </Avatar>
                    <span>
                      <span
                        onClick={() =>
                          router.push(
                            `/perfil/${
                              friend.user_id !== userId
                                ? friend.user_id
                                : friend.friend_id
                            }`,
                          )
                        }
                        className="cursor-pointer"
                      >
                        {friend.user_id !== userId
                          ? friend.user_name
                          : friend.friend_name}
                      </span>
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteFriend(friend.id)}
                  >
                    Cancelar Solicitud
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
