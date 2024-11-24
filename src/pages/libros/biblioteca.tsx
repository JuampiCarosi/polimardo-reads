import { useQuery, useQueryClient } from "react-query";
import { type Book } from "../api/books/[id]";
import { Header } from "@/components/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import Image from "next/image";
import { Pill } from "@/components/pill";
import { statusColors, statusLabels } from "./[id]";

import { toast } from "sonner";
import { type BookRating } from "../api/books/[id]/rating";
import { Stars } from "@/components/stars-rating";
import { useRouter } from "next/router";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";

export default function Page() {
  const { data } = useQuery<Book[]>({
    queryKey: ["books", "library"],
  });

  const readBooks = data?.filter((book) => book.status === "read");
  const wantToReadBooks = data?.filter((book) => book.status === "wantToRead");
  const currentlyReadingBooks = data?.filter(
    (book) => book.status === "reading",
  );

  const queryClient = useQueryClient();

  async function handleRatingChange(bookId: string, rating: number | null) {
    queryClient.setQueryData<Book[] | undefined>(
      ["books", `library`],
      (oldData) => {
        const book = oldData?.find((b) => b.id === bookId);
        if (!oldData || !book) return oldData;
        book.selfRating = rating;
        return oldData;
      },
    );
    const response = await fetch(`/api/books/${bookId}/rating`, {
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
    toast.success(
      data
        ? `Valoración del libro actualizada a ${rating} estrellas`
        : "Valoración eliminada",
    );
    await queryClient.invalidateQueries(["books", "library"]);
  }

  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <Card className="mx-auto mt-4 w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl">Mi Biblioteca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h2 className="mb-2 text-2xl font-semibold">Libros leidos</h2>
            {readBooks?.length ? (
              BooksTableDisplayer(readBooks)
            ) : (
              <span className="pb-4 pt-4">
                No tienes libros marcados como leidos actualmente
              </span>
            )}
          </div>
          <div className="mb-4">
            <h2 className="mb-2 text-2xl font-semibold">
              Libros que estas leyendo actualmente
            </h2>
            {currentlyReadingBooks?.length ? (
              BooksTableDisplayer(currentlyReadingBooks)
            ) : (
              <span className="pb-4 pt-4">
                No estas leyendo libros actualmente
              </span>
            )}
          </div>
          <div className="mb-4">
            <h2 className="mb-2 text-2xl font-semibold">
              Libros para un futuro
            </h2>
            {wantToReadBooks?.length ? (
              BooksTableDisplayer(wantToReadBooks)
            ) : (
              <span className="pb-4 pt-4">
                No tienes ningun libro para leer en un futuro actualmente
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
  function BooksTableDisplayer(data: Book[]) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Preview</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-center">Calificacion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow
              onClick={() => router.push(`/libros/${item.id}`)}
              key={item.isbn}
              className="cursor-pointer"
            >
              <TableCell>
                {item.cover_img && (
                  <Image
                    src={item.cover_img}
                    alt={item.title}
                    width={40}
                    height={40}
                  />
                )}
              </TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.author}</TableCell>
              <TableCell>
                <Pill className="px-2 py-1" color={statusColors[item.status!]}>
                  {statusLabels[item.status!]}
                </Pill>
              </TableCell>
              <TableCell className="text-center">
                <Stars
                  rating={item.selfRating ?? undefined}
                  onClick={(rating) => handleRatingChange(item.id, rating)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export const getServerSideProps = getServerSidePropsWithAuth();
