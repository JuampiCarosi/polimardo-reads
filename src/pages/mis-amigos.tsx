import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useQuery } from "react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Friendship } from "./api/myFriends";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";

function fetch_friendships_with_both_users_data() {
  const possible_friendships = useQuery<Friendship[]>({
    queryKey: ["myFriends"],
  });
  return possible_friendships;
}

export default function Component() {
  const session = useSession();
  const router = useRouter();

  const user_id = session.data?.user.id;
  const possible_friendships = fetch_friendships_with_both_users_data();

  const added_friends = possible_friendships.data?.filter(
    (friend) =>
      friend.is_added &&
      (friend.user_id === user_id || friend.friend_id === user_id),
  );

  const pending_friends = possible_friendships.data?.filter(
    (friend) => friend.user_id === session.data?.user.id && !friend.is_added,
  );

  const friend_requests = possible_friendships.data?.filter(
    (friend) => friend.friend_id === session.data?.user.id && !friend.is_added,
  );

  const handleAddFriend = async (id: string, friend_id: string) => {
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

    void possible_friendships.refetch();

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

    void possible_friendships.refetch();

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
              Administra tus Amigos!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Amigos</h2>
              </div>
              {added_friends?.length === 0 ? (
                <div className="">
                  No tienes amigos actualmente!{" "}
                  <Link className="hover:underline" href={"/amigos"}>
                    {" "}
                    <span className="font-bold underline">
                      Agrega nuevos amigos aqui{" "}
                    </span>
                  </Link>
                </div>
              ) : (
                added_friends?.map((friend, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={
                          friend.user_id !== user_id
                            ? friend.user_image
                            : friend.friend_image
                        }
                        onClick={() =>
                          router.push(
                            `/perfil/${
                              friend.user_id !== user_id
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
                            friend.user_id !== user_id
                            ? friend.user_id
                            : friend.friend_id
                          }`,
                          )
                        }
                        className="cursor-pointer"
                        >
                        {friend.user_id !== user_id
                          ? friend.user_name
                          : friend.friend_name}
                        </span>
                    </span>
                    <Button
                      className="ml-4 flex-shrink-0"
                      size="sm"
                      onClick={() => handleDeleteFriend(friend.id)}
                    >
                      Eliminar Amigo
                    </Button>
                  </div>
                ))
              )}
              <Separator className="mt-4"></Separator>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Solicitudes de Amistad</h2>
              </div>
              {friend_requests?.length === 0 ? (
                <div className="text-m">
                  No tienes solicitudes de amistad pendientes
                </div>
              ) : (
                friend_requests?.map((friendship, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={friendship.user_image}
                        onClick={() =>
                          router.push(
                            `/perfil/${
                              friendship.user_id !== user_id
                              ? friendship.user_id
                              : friendship.friend_id
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
                            friendship.user_id !== user_id
                            ? friendship.user_id
                            : friendship.friend_id
                          }`,
                          )
                        }
                        className="cursor-pointer"
                        >
                        {friendship.user_id !== user_id
                          ? friendship.user_name
                          : friendship.friend_name}
                        </span>
                    </span>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleAddFriend(friendship.id, friendship.friend_id)
                      }
                    >
                      Aceptar
                    </Button>
                  </div>
                ))
              )}
              <Separator className="mt-4"></Separator>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Solicitudes Pendientes</h2>
              </div>
              {pending_friends?.length === 0 ? (
                <div className="text-m">
                  No tienes solicitudes de amistad enviadas pendientes
                </div>
              ) : (
                pending_friends?.map((friend, index) => (
                  <>
                    <div
                      key={index}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar>
                          <AvatarImage
                            src={friend.friend_image}
                            onClick={() =>
                              router.push(
                                `/perfil/${
                                  friend.user_id !== user_id
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
                            friend.user_id !== user_id
                            ? friend.user_id
                            : friend.friend_id
                          }`,
                          )
                        }
                        className="cursor-pointer"
                        >
                        {friend.user_id !== user_id
                          ? friend.user_name
                          : friend.friend_name}
                        </span>
                    </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleDeleteFriend(friend.id)}
                      >
                        Cancelar Solicitud
                      </Button>
                    </div>
                    {index != pending_friends.length - 1 ? (
                      <Separator></Separator>
                    ) : null}
                  </>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
