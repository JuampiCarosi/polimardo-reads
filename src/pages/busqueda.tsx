import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
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
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "react-query";
import router from "next/router";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import { type BookRaw } from "./api/books/[id]";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { data, isLoading } = useQuery<BookRaw[]>({
    queryKey: ["books", "search", `?q=${search}&filter=${filter}`],
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <Card className="mx-auto mt-4 w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Buscar Libros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-2">
            <div className="flex w-full">
              <Input
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mr-2"
              />
              {isLoading && (
                <div role="status" className="my-auto -ml-10 w-[40.5px]">
                  <LoadingSpinner />
                </div>
              )}
            </div>
            <div className="w-32">
              <Select value={filter ?? undefined} onValueChange={setFilter}>
                <SelectTrigger id="filter">
                  <SelectValue placeholder="Seleccionar filtro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                  <SelectItem value="genre">Género</SelectItem>
                  <SelectItem value="author">Autor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Autor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item) => <BookDialog key={item.isbn} item={item} />)}
            </TableBody>
          </Table>
          {data?.length === 0 && (
            <p className="mt-4 text-center text-gray-500">No results found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BookDialog({ item }: { item: BookRaw }) {
  const queryClient = useQueryClient();

  return (
    <Dialog key={item.id}>
      <DialogTrigger asChild>
        <TableRow className="cursor-pointer">
          <TableCell>
            {item.cover_img && (
              <Image
                src={item.cover_img}
                alt={item.title}
                width={56}
                height={56}
              />
            )}
          </TableCell>
          <TableCell>{item.title}</TableCell>
          <TableCell>{item.author}</TableCell>
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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={item.title}
              src={item.cover_img}
              className="my-auto size-56 rounded-lg border"
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
