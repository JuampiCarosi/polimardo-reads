"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { type ListDetailed } from "../api/lists/[id]";
import Image from "next/image";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { BookSelector } from "@/components/books-selector";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";

export default function Component() {
  const [newComment, setNewComment] = React.useState("");
  const router = useRouter();
  const { id } = router.query;

  const { data, refetch } = useQuery<ListDetailed>({
    queryKey: ["lists", id as string],
    enabled: typeof id === "string",
  });

  const postCommentMutation = useMutation({
    onSuccess: async () => {
      await refetch();
      setNewComment("");
    },
    onError: (error) => {
      toast.error("Hubo un error al agregar el comentario");
      console.error(error);
    },
    mutationFn: async () => {
      if (!newComment || newComment.length < 1 || typeof id !== "string") {
        toast.error("El comentario no puede estar vacio");
        return;
      }
      const res = await fetch(`/api/lists/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: newComment,
        }),
      });
      if (res.ok) {
        toast.success("Comentario agregado correctamente");
      }
    },
  });

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    postCommentMutation.mutate();
  };
  const session = useSession();

  async function handleVoteBook(bookId: string, action: "add" | "remove") {
    if (typeof id !== "string") {
      toast.error("No se encontro la lista");
      return;
    }

    if (!session.data?.user) {
      toast.error("Necesitas estar logueado para votar");
      return;
    }

    const res = await fetch(`/api/lists/${id}/vote`, {
      method: action === "add" ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId: bookId,
        listId: id,
        userId: session.data.user.id,
      }),
    });

    if (res.ok) {
      if (action === "add") {
        toast.success("Libro agregado correctamente");
      } else {
        toast.success("Voto removido");
      }
      await refetch();
    } else {
      toast.error("Hubo un error al agregar el libro");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 space-y-3">
            <h1 className="text-3xl font-bold text-slate-900">{data?.name}</h1>
            <div className="flex gap-2">
              {data?.genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="bg-slate-300 text-slate-700 hover:bg-slate-300"
                >
                  {genre}
                </Badge>
              ))}
            </div>
            <div className="mt-2 text-slate-600">{data?.description}</div>
          </div>
          <div className="mb-2 flex w-full justify-end">
            <BookSelector
              dontSelect
              onSelect={async (v) => await handleVoteBook(v.id, "add")}
            >
              <Button size="sm">Agregar libro</Button>
            </BookSelector>
          </div>

          <div className="rounded-md border border-slate-200 bg-white px-3 pb-3 pt-1">
            {data?.books.length === 0 ? (
              <div className="flex justify-center py-10 text-sm font-semibold text-slate-500">
                {" "}
                No hay libros en esta lista
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Libro</TableHead>
                    <TableHead>Votos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.books?.map((item) => (
                    <TableRow
                      onClick={() => router.push(`/libros/${item.id}`)}
                      key={item.id}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        {item.cover_img && (
                          <Image
                            src={item.cover_img}
                            alt={item.title}
                            className="rounded-lg"
                            width={80}
                            height={80}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-slate-500">por {item.author}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {Boolean(item.self_voted) ? (
                            <Button
                              onClick={(e) => {
                                void handleVoteBook(item.id, "remove");
                                e.stopPropagation();
                              }}
                              variant="outline"
                            >
                              Sacar mi voto
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => {
                                void handleVoteBook(item.id, "add");
                                e.stopPropagation();
                              }}
                              variant="outline"
                            >
                              Votar por el libro
                            </Button>
                          )}
                        </div>
                        <div className="pl-2 pt-1 text-slate-500">
                          {item.book_votes} votos
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Comments</h2>
            <div className="space-y-4">
              {data?.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg bg-white p-4 shadow"
                >
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={comment.user_img}
                        alt={comment.user_name}
                      />
                      <AvatarFallback className="border border-slate-400">
                        {comment.user_name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-slate-900">
                          {comment.user_name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {format(comment.created_at, "dd-MM-yyyy")}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-slate-700">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-4 bg-white"
              />
              <Button disabled={postCommentMutation.isLoading} type="submit">
                Post Comment
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth();
