import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Header } from "@/components/header";
import { type Book } from "../api/books/[id]";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { type BookStatus } from "../api/books/[id]/status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Stars } from "@/components/stars-rating";
import { type BookRating } from "../api/books/[id]/rating";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { BookReview } from "../api/books/[id]/reviews";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import { useSession } from "next-auth/react";

export const statusLabels = {
  reading: "leyendo",
  read: "leído",
  wantToRead: "quiero leer",
} as const;

export const statusColors = {
  reading: "yellow",
  read: "green",
  wantToRead: "blue",
} as const;

export default function Home() {
  const [newReview, setNewReview] = React.useState("");
  const router = useRouter();
  const id = router.query.id;
  
  const { data: reviews, refetch } = useQuery<BookReview[]>({
    queryKey: ["books", id, "reviews"],
    enabled: typeof id === "string",
  });

  const postReviewMutation = useMutation({
    onSuccess: async () => {
      await refetch();
      setNewReview("");
    },
    onError: (error: any) => {
      toast.error("Hubo un error al agregar la review");
      console.error(error);
    },
    mutationFn: async () => {
      if (!newReview || newReview.length < 1 || typeof id !== "string") {
        toast.error("La review no puede estar vacia");
        return;
      }
      const res = await fetch(`/api/books/${id}/post_review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review: newReview,
        }),
      });
      if (res.ok) {
        toast.success("Review agregada correctamente");
      }
    },
  });
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    postReviewMutation.mutate();
  };
  const session = useSession();

  const { data: book } = useQuery<Book>({
    queryKey: ["books", id],
    enabled: typeof id === "string",
  });

  const queryClient = useQueryClient();

  async function handleRatingChange(rating: number | null) {
    if (!book) return;
    queryClient.setQueryData<Book | undefined>(
      ["books", `${book.id}`],
      (oldData) => {
        if (!oldData) return oldData;
        return { ...oldData, selfRating: rating };
      },
    );
    const response = await fetch(`/api/books/${book.id}/rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });

    if (!response.ok) {
      console.error("Error adding book rating", response);
      toast.error("Error agregando valoración al libro");
      return;
    }

    const data = (await response.json()) as BookRating;
    if (data?.added_to_library) toast.success("Libro agregado a la biblioteca");

    toast.success(
      data
        ? `Valoración del libro actualizada a ${rating} estrellas`
        : "Valoración eliminada",
    );

    await queryClient.invalidateQueries(["books", `${book.id}`]);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <Card className="mx-auto mt-6 max-w-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {book?.title}{" "}
                <span className="text-slate-600">#{book?.isbn}</span>
              </CardTitle>
              <CardDescription>by {book?.author}</CardDescription>
              <div className="flex flex-wrap items-center gap-1 pt-2">
                {book?.genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="text-nowrap bg-slate-300 text-slate-700 hover:bg-slate-300"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="pt-4">{book && <BookStatusPill book={book} />}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6 pt-2">
            <div className="flex flex-col items-center space-y-2">
              {book?.cover_img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={book?.title}
                  src={book?.cover_img}
                  className="my-auto w-80 rounded-lg border"
                />
              )}
              <a
                href={`https://www.amazon.com/s?k=${book?.title}`}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button
                  size="sm"
                  className="h-auto w-full py-1"
                  variant="outline"
                >
                  Ver en Amazon
                </Button>
              </a>
              <Stars
                rating={book?.selfRating ?? undefined}
                onClick={handleRatingChange}
              />
              <span
                className={cn(
                  "text-xs text-gray-500 transition-colors",
                  book?.selfRating && "text-white",
                )}
              >
                Deja tu opinión!
              </span>
            </div>
            <div>
              <div className="flex flex-col pb-2 text-sm font-medium text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">
                    Publicado por:
                  </span>{" "}
                  {book?.publisher}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">
                    Año de publicación:
                  </span>{" "}
                  {book?.publish_year}
                </div>
              </div>

              <p className="max-h-72 overflow-y-auto text-sm text-slate-800">
                {book?.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mx-auto mt-6 max-w-3xl">
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Reseñas de otros lectores</h2>
            <div className="space-y-4">
              {reviews?.map((review) => (
                <div
                  key={review.user_id}
                  className="rounded-lg bg-white p-4 shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <Avatar>
                        <AvatarImage
                          src={review.user_img || ""}
                          alt={review.user_name || ""}
                        />
                        <AvatarFallback className="border border-slate-400">
                          {review.user_name?.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-xs text-slate-500 mb-2 mt-2">
                        {review.rating}⭐
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-slate-900">
                          {review.user_name || "Anónimo"}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {format(review.created_at, "dd-MM-yyyy")}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-slate-700">
                        {review.review}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          <form onSubmit={handleReviewSubmit} className="mt-4">
            <Textarea
              placeholder="Dejá tu opinión..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="mb-4 mt-4 bg-white"
            />
            <Button disabled={postReviewMutation.isLoading} type="submit">
              Post Review
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function BookStatusPill({ book }: { book: Book }) {
  const queryClient = useQueryClient();

  const updateStatus = async (
    status: "reading" | "read" | "wantToRead" | null,
  ) => {
    const response = await fetch(`/api/books/${book.id}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      console.error("Error adding book to library", response);
      toast.error("Error agregando libro a la biblioteca");
      return;
    }

    const data = (await response.json()) as BookStatus;
    toast.success(
      data
        ? `Estado del libro actualizado a ${statusLabels[data.status]} `
        : "Libro eliminado de la biblioteca",
    );
    await queryClient.invalidateQueries(["books", `${book.id}`]);
  };

  const pill = {
    read: (
      <div className="cursor-pointer text-nowrap rounded-full border border-green-400 bg-green-100 px-2.5 py-0.5 text-xs text-green-700 hover:bg-green-200">
        {statusLabels.read}
      </div>
    ),
    null: (
      <div className="cursor-pointer text-nowrap rounded-full border border-slate-400 bg-slate-100 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-200">
        Agregar a biblioteca +
      </div>
    ),
    wantToRead: null,
    reading: null,
  } as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{pill[book.status ?? "null"]}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {book.status !== "read" && (
            <DropdownMenuItem
              onClick={() => updateStatus("read")}
              className="px-2 py-1"
            >
              <span className="text-xs">Marcar como leído</span>
            </DropdownMenuItem>
          )}
          {book.status !== null && (
            <DropdownMenuItem
              onClick={() => updateStatus(null)}
              className="px-2 py-1"
            >
              <span className="text-xs">Eliminar de biblioteca</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
