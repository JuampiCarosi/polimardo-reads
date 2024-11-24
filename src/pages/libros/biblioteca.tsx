import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, CheckCircle2, Library } from "lucide-react";
import Image from "next/image";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";
import type { Book } from "../api/books/[id]";
import { Stars } from "@/components/stars-rating";

import { toast } from "sonner";
import type { BookRating } from "../api/books/[id]/rating";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "react-query";
import { Header } from "@/components/header";

export default function LibraryView() {
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

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-center text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Mi Biblioteca
          </h1>

          <div className="space-y-8">
            <BookSection
              title="Libros leídos"
              icon={CheckCircle2}
              books={readBooks ?? []}
              emptyMessage="No tienes libros marcados como leídos actualmente"
              onRatingChange={handleRatingChange}
            />
            <BookSection
              title="Leyendo actualmente"
              icon={BookOpen}
              books={currentlyReadingBooks ?? []}
              emptyMessage="No estás leyendo libros actualmente"
              onRatingChange={handleRatingChange}
            />
            <BookSection
              title="Libros para un futuro"
              icon={Library}
              books={wantToReadBooks ?? []}
              emptyMessage="No tienes ningún libro para leer en un futuro actualmente"
              onRatingChange={handleRatingChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface BookSectionProps {
  title: string;
  icon: React.ElementType;
  books: Book[];
  emptyMessage: string;
  onRatingChange: (bookId: string, rating: number | null) => Promise<void>;
}

function BookSection({
  title,
  icon: Icon,
  books,
  emptyMessage,
  onRatingChange: handleRatingChange,
}: BookSectionProps) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="bg-slate-300">
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
          <Icon className="h-6 w-6 text-slate-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {books.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-1">
                <TableHead className="w-[100px]">Portada</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden sm:table-cell">Autor</TableHead>
                <TableHead className="text-right">Calificación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow
                  key={book.isbn}
                  className="group cursor-pointer px-11 transition-colors hover:bg-slate-50"
                  onClick={() => router.push(`/libros/${book.id}`)}
                >
                  <TableCell className="p-2">
                    {book.cover_img ? (
                      <Image
                        src={book.cover_img}
                        alt={book.title}
                        width={60}
                        height={90}
                        className="rounded-sm object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-[90px] w-[60px] items-center justify-center rounded-sm bg-slate-200 text-slate-400">
                        <Library className="h-8 w-8" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell className="hidden text-slate-600 sm:table-cell">
                    {book.author}
                  </TableCell>
                  <TableCell className="text-right">
                    <Stars
                      rating={book.selfRating ?? undefined}
                      onClick={(rating) => handleRatingChange(book.id, rating)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center p-8 text-center text-slate-500">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth();
