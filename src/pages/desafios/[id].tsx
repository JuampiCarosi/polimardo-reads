import { Header } from "@/components/header";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { type Challenge } from "@/pages/api/challenges/[id]";
import { useSession } from "next-auth/react";
import { type User } from "../api/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { type Book, type BookRaw } from "../api/books/[id]";
import { useEffect, useState } from "react";
import { Pill } from "@/components/pill";
import { Progress } from "@/components/ui/progress";
import { type MyChallenges } from "../api/challenges";
import { toast } from "sonner";
import { formatNumber } from "@/lib/numbers";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";

export default function Challenge() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const { id } = router.query;

  const { data: challenge, refetch: refetchChallenges } = useQuery<Challenge>({
    queryKey: ["challenges", id as string],
    enabled: typeof id === "string",
  });

  const { data: creator, refetch: refetchUserData } = useQuery<User>({
    queryKey: ["users", `?id=${challenge?.created_by}`],
    enabled: typeof id === "string",
  });

  const { data: bookRead, refetch: refetchbooksRead } = useQuery<Book[]>({
    queryKey: ["books", "library"],
  });

  const { data: myChallenges } = useQuery<MyChallenges[]>({
    queryKey: ["challenges?user=" + userId],
  });

  const myChallengesIds = myChallenges?.map((challenge) => challenge.id);

  const getBookData = async (id: string) => {
    const response = await fetch(`/api/books/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch book");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const bookData: BookRaw = await response.json();
    return bookData;
  };

  const getPartialProgress = () => {
    const totalBooks = challenge?.book_ids.length;
    const readBooks = bookRead?.filter(
      (book) => challenge?.book_ids.includes(book.id) && book.status === "read",
    ).length;
    if (readBooks !== undefined && totalBooks !== undefined && totalBooks > 0) {
      return (readBooks / totalBooks) * 100;
    }
    return 0;
  };

  const [books, setBooks] = useState<BookRaw[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!challenge?.book_ids) return;
      try {
        const booksData = await Promise.all(
          challenge.book_ids.map((book_id) => getBookData(book_id)),
        );
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    void fetchBooks();
  }, [challenge]);

  const joinChallengeMutation = useMutation({
    onSuccess: async () => {
      toast.success("¡Te uniste al desafío!");
      await refetchChallenges();
      await refetchUserData();
      await refetchbooksRead();
      return queryClient.invalidateQueries("challenges?user=" + userId);
    },
    onError: (error) => {
      toast.error("Hubo un error al unirse al desafío");
      console.error(error);
    },
    mutationFn: async () => {
      if (typeof id !== "string") {
        console.error("Invalid challenge ID");
        return;
      }
      const response = await fetch(`/api/challenges/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, challengeId: id }),
      });

      if (!response.ok) {
        console.error("Error joining challenge", response);
        throw new Error("Error joining challenge");
      }
    },
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 space-y-3">
            <h1 className="text-3xl font-bold text-slate-900">
              {challenge?.name}
            </h1>
            <div className="font-bold">
              <div className="text-sm">Creador por: {creator?.name}</div>
            </div>
            <div className="flex gap-2 text-lg text-teal-800">
              <Pill color={"blue"}>
                {challenge?.participants ?? 0}{" "}
                {(challenge?.participants ?? 0) === 1
                  ? "Participante"
                  : "Participantes"}
              </Pill>
              <Pill color={"yellow"}>
                {challenge?.book_ids?.length ?? 0}{" "}
                {(challenge?.book_ids?.length ?? 0) > 1 ? "Libros" : "Libro"}
              </Pill>
            </div>

            <div className="mt-2 grid grid-cols-2 py-5 text-slate-600">
              {challenge?.description}
            </div>
            <div className="flex gap-4 rounded-sm">
              <Pill className="px-2 py-1" color={"green"}>
                Comienza: {challenge?.start_date}
              </Pill>
              <Pill className="px-2 py-1" color={"red"}>
                Finaliza: {challenge?.end_date}
              </Pill>
            </div>
            {typeof id === "string" && myChallengesIds?.includes(id) && (
              <div className="text-slate-600">
                Progreso del desafío:{" "}
                {formatNumber(getPartialProgress(), { emptyValues: "0" })}%
              </div>
            )}
            <div className="mb-2 flex w-full justify-center">
              {typeof id === "string" && myChallengesIds?.includes(id) && (
                <Progress value={getPartialProgress()} />
              )}
            </div>
            <div className="flex justify-end">
              {typeof id === "string" && !myChallengesIds?.includes(id) && (
                <Button
                  size="sm"
                  onClick={() => {
                    joinChallengeMutation.mutate();
                  }}
                >
                  Unirse al desafío
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white px-3 pb-3 pt-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Libro</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => {
                  const status = bookRead?.find(
                    (item) => item.id === book.id,
                  )?.status;
                  return (
                    <TableRow
                      onClick={() => router.push(`/libros/${book.id}`)}
                      key={book.id}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        {book.cover_img && (
                          <Image
                            src={book.cover_img}
                            alt={book.title}
                            className="rounded-lg"
                            width={80}
                            height={80}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{book.title}</div>
                        <div className="text-slate-500">por {book.author}</div>
                      </TableCell>
                      <TableCell>
                        <Pill
                          className="px-2 py-1"
                          color={status === "read" ? "green" : "red"}
                        >
                          {status === "read" ? "Leído" : "No leído"}
                        </Pill>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth();
