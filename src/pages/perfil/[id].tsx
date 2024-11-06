import { Header } from "@/components/header";
import { type User } from "../api/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cake, Flag, Mail, MapPin, User as UserComponent } from "lucide-react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { type Genres } from "../api/user-preferred-genres";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Friendship } from "../api/myFriends";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

function firstLetterToUpperCase(str: string | undefined | null) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  const { data: user } = useQuery<User>({
    queryKey: ["users", `?id=${id as string}`],
    enabled: typeof id === "string",
  });

  const {
    data: genres,
    isLoading: isLoadingGenres,
    error: errorGenres,
  } = useQuery<Genres[]>({
    queryKey: ["user-preferred-genres", `?id=${id as string}`],
    enabled: typeof id === "string",
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="position-relative mx-auto mt-14 items-center">
        {user && (
          <Card className="mx-auto max-w-2xl p-10">
            <CardHeader>
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name ?? ""}
                    />
                    <AvatarFallback>
                      <UserComponent className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <CardDescription>{user.role}</CardDescription>
                  </div>
                </div>
                <FriendButton />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="text-muted-foreground h-5 w-5" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cake className="text-muted-foreground h-5 w-5" />
                    <span>{user.birth_date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="text-muted-foreground h-5 w-5" />
                    <span>{user.country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flag className="text-muted-foreground h-5 w-5" />
                    <span>{firstLetterToUpperCase(user.gender)}</span>
                  </div>
                </div>

                <Separator className="mt-8"></Separator>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Géneros favoritos</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <span>
                    {isLoadingGenres ? (
                      "Loading..."
                    ) : errorGenres ? (
                      "Error loading genres"
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {genres?.map((genre) => (
                          <Badge
                            key={genre.id}
                            variant="secondary"
                            className="bg-slate-200 text-slate-700 hover:bg-slate-200"
                          >
                            {genre.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function FriendButton() {
  const session = useSession();
  const router = useRouter();
  const { id } = router.query;

  const { data: friends, refetch: refetchFriends } = useQuery<Friendship[]>({
    queryKey: ["myFriends"],
  });

  const friendship = friends
    ? friends.find((friend) => friend.friend_id === id || friend.user_id === id)
    : null;

  if (
    !session.data?.user.id ||
    friendship === null ||
    typeof id !== "string" ||
    session.data?.user.id === id
  )
    return null;

  const addFriend = async () => {
    const response = await fetch("/api/friendships", {
      method: "POST",
      body: JSON.stringify({ user_id: session.data?.user.id, friend_id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast.error("Error mandando solicitud de amistad");
      console.error(await response.json());
      return;
    }

    toast.success("Solicitud de amistad enviada");
    void refetchFriends();
  };

  const acceptRequest = async () => {
    const response = await fetch("/api/friendships", {
      method: "PATCH",
      body: JSON.stringify({
        id: friendship?.id,
        is_added: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    void refetchFriends();

    if (!response.ok) {
      toast.error("Ocurrio un error al agregar al amigo");
      console.error(await response.json());
      return;
    }

    toast.success("Amigo agregado correctamente");
  };

  const deleteFriend = async () => {
    const response = await fetch("/api/friendships", {
      method: "DELETE",
      body: JSON.stringify({ id: friendship?.id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    void refetchFriends();

    if (!response.ok) {
      toast.error("Error eliminando amigo");
      console.error(await response.json());
      return;
    }

    toast.success("Amigo eliminado correctamente");
  };

  if (!friendship) {
    return (
      <Button onClick={addFriend} size="xs">
        + agregar amigo
      </Button>
    );
  }

  if (friendship.is_added) {
    return (
      <Button variant="outline" onClick={deleteFriend} size="xs">
        eliminar amigo
      </Button>
    );
  }

  if (friendship.friend_id === id) {
    return (
      <Button disabled variant="outline" onClick={deleteFriend} size="xs">
        solicitud enviada
      </Button>
    );
  }

  return (
    <Button onClick={acceptRequest} size="xs">
      aceptar solicitud
    </Button>
  );
}
