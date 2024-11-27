import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useQueryClient } from "react-query";
import Head from "next/head";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import Image from "next/image";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import router from "next/router";
import { type BookWithBlob } from "./api/books/recommended/favoriteGenres";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";
import { boolean } from "zod";
import { useState } from "react";
import { Feed } from "./api/feed";
import { Friendship } from "./api/myFriends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [genreRecommendation, setGenreRecommendation] = useState<boolean>(true);
  const [favouriteBooksRecommendation, setFavouriteBooksRecommendation] = useState<boolean>(false);

  const { data: favoriteGenresData, isLoading: isLoadingFavoriteGenres, refetch: refetchFavoriteGenres, isFetching: isFetchingFavoriteGenres } = useQuery<BookWithBlob[]>({
    queryKey: ["books", "recommended", "favoriteGenres"],
    refetchOnWindowFocus: false,
  });

  const { data: favoriteBooksData, isLoading: isLoadingFavoriteBooks, refetch: refetchFavoriteBooks, isFetching: isFetchingFavoriteBooks } = useQuery<BookWithBlob[]>({
    queryKey: ["books", "recommended", "favoriteBooks"],
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const { data: feed } = useQuery<Feed[]>({
    queryKey: ["feed"],
    refetchOnWindowFocus: false,
  });

  const { data: myFriends } = useQuery<Friendship[]>({
    queryKey: ["myFriends"],
  })

  const getFriendName = (friendId: string) => {
    console.log(friendId);
    const friend = myFriends?.find(friend => friend.user_id === friendId);
    return friend?.user_name;
  }

  const getFriendImage = (friendId: string) => {
    const friend = myFriends?.find(friend => friend.user_id === friendId);
    return friend?.user_image;
  }




  return (
    <>
      <Head>
        <title>Polimardo Reads</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-slate-100">
        <Header />
        <Link
          href={"/busqueda"}
          className="flex w-full select-none items-center justify-center gap-1 pt-4 text-sm font-medium text-blue-700/90"
        ></Link>

        <div className="mx-auto mt-4 w-full max-w-4xl">
          <h3 className="text- pb-3 pl-2 font-medium text-slate-900">
            Enterate de las últimas novedades de tus amigos!
          </h3>

          <Card className="pt-2">
            <div className="grid grid-cols-1 lg:gap-1">
              {feed?.map((item) => {
                const getActivityText = (activity: string) => {
                  switch (activity) {
                    case "createdChallenge":
                      return `${getFriendName(item.friend_id)} creó el desafío: "${item.activity_id}"`;
                    case "joinedChallenge":
                      return `${getFriendName(item.friend_id)} se unió al desafío: "${item.activity_id}"`;
                    case "reading":
                      return `${getFriendName(item.friend_id)} comenzó a leer: "${item.activity_id}"`;
                    case "read":
                      return `${getFriendName(item.friend_id)} leyó por completo: "${item.activity_id}"`;
                    case "wantToRead":
                      return `${getFriendName(item.friend_id)} quiere leer: "${item.activity_id}"`;
                    default:
                      if (activity.includes("ratedBook")) {
                        const rating = activity.split(" ")[1];
                        return `${getFriendName(item.friend_id)} calificó: "${item.activity_id}" con ${rating} estrellas`;
                      }
                      return null;
                  }
                };

                const activityText = getActivityText(item.activity);

                if (!activityText) return null;

                return (
                  <div key={item.activity_id}>
                    <div 
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50">  
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={getFriendImage(item.friend_id) ?? undefined} />
                      </Avatar>
                      <div>
                        <div className="font-medium">{activityText}</div>
                      </div>
                    </div>
                    </div>
                    <Separator></Separator>

                    </div>
                );
              })}
            </div>
          </Card>
        </div>


        <div className="mx-auto mt-4 w-full max-w-4xl py-8">
          <h3 className="text- pb-3 pl-2 font-medium text-slate-900">
            No sabes que leer? Mira nuestras recomendaciones personalizadas para
            vos!
          </h3>
          <Card className="pt-2">
            <div className="gap-3 flex justify-end pr-3 pt-1">
              <Button disabled={isFetchingFavoriteGenres} onClick={async () => {
                await refetchFavoriteGenres()
                setFavouriteBooksRecommendation(false);
                setGenreRecommendation(true)
              }} size="sm">
                {isFetchingFavoriteGenres ? (
                  <>
                    <span>Buscando nuevas </span>
                    <LoadingSpinner />
                  </>
                ) : (
                  "Por género"
                )}
              </Button>
              <Button disabled={isFetchingFavoriteBooks} onClick={async () => {
                await refetchFavoriteBooks();
                setGenreRecommendation(false);
                setFavouriteBooksRecommendation(true);

              }} size="sm">
                {isFetchingFavoriteBooks ? (
                  <>
                    <span>Buscando nuevas </span>
                    <LoadingSpinner />
                  </>
                ) : (
                  "Por libros que me gustaron"
                )}
              </Button>
            </div>



            <CardContent>
              {isLoadingFavoriteGenres ? (
                <div className="flex items-center justify-center gap-2 pt-4 text-center text-sm font-medium text-slate-500">
                  <span>Analizando tus preferencias </span>
                  <LoadingSpinner />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Preview</TableHead>
                      <TableHead>Titulo</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead>Géneros</TableHead>
                    </TableRow>
                  </TableHeader>
                  {genreRecommendation && (<TableBody>
                    {favoriteGenresData?.map((item) => (
                      <BookDialog key={item.isbn} item={item} />
                    ))}
                  </TableBody>)}
                  {favouriteBooksRecommendation && (
                    <TableBody>
                      {favoriteBooksData && favoriteBooksData.length > 0 ? (
                        favoriteBooksData.map((item) => (
                          <BookDialog key={item.isbn} item={item} />
                        ))
                      ) : (
                        <div className="flex items-center gap-2 pt-4 text-center text-sm font-medium text-slate-500">
                          <span>No hay suficientes reseñas para recomendar libros.</span>
                        </div>
                      )}
                    </TableBody>
                  )}

                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function BookDialog({ item }: { item: BookWithBlob }) {
  const queryClient = useQueryClient();

  return (
    <Dialog key={item.id}>
      <DialogTrigger asChild>
        <TableRow className="cursor-pointer">
          <TableCell>
            <Image
              src={item.cover_blob ?? ""}
              alt={item.title}
              className="my-auto rounded-md border"
              width={70}
              height={44}
            />
          </TableCell>
          <TableCell>{item.title}</TableCell>
          <TableCell>{item.author}</TableCell>
          <TableCell>{item.genres.join(", ")}</TableCell>
        </TableRow>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {item.title} <span className="text-slate-600">#{item.isbn}</span>
          </DialogTitle>
          <DialogDescription>by {item.author}</DialogDescription>
          <div className="flex flex-wrap items-center gap-1">
            {item.genres.map((genre) => (
              <Badge
                key={genre}
                variant="secondary"
                className="text-nowrap bg-slate-300 text-slate-700 hover:bg-slate-300"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </DialogHeader>
        <div className="flex items-start gap-6 pt-2">
          {item.cover_img && (
            <Image
              alt={item.title}
              src={item.cover_blob ?? item.cover_img}
              className="my-auto rounded-lg border"
              width={180}
              height={180}
            />
          )}
          <div>
            <div className="flex flex-col pb-2 text-sm font-medium text-slate-600">
              <div>
                <span className="font-semibold text-slate-800">
                  Publicado por:
                </span>{" "}
                {item.publisher}
              </div>
              <div>
                <span className="font-semibold text-slate-800">
                  Año de publicación:
                </span>{" "}
                {item.publish_year}
              </div>
            </div>

            <p className="max-h-56 overflow-y-auto text-sm text-slate-800">
              {item.description}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              await queryClient.prefetchQuery(["books", item.id], () =>
                fetch(`/api/books/${item.id}`).then((res) => res.json()),
              );
              void router.push(`/libros/${item.id}`);
            }}
          >
            Ver más
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth(async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session?.user.onboarding_completed) {
    return {
      redirect: {
        destination: "/welcome",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});
