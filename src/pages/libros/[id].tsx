import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "react-query";
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
  const router = useRouter();
  const id = router.query.id;
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
            </div>
            {book && <BookStatusPill book={book} />}
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
      <div className="cursor-pointer rounded-full border border-green-400 bg-green-100 px-2.5 py-0.5 text-xs text-green-700 hover:bg-green-200">
        {statusLabels.read}
      </div>
    ),
    null: (
      <div className="cursor-pointer rounded-full border border-slate-400 bg-slate-100 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-200">
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
