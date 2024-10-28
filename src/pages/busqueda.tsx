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
import { type Book } from "./api/books/[id]";

export default function Page() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<Book[]>({
    queryKey: ["books", "search", `?book=${search}`],
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <Card className="mx-auto mt-4 w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Buscar Libros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex">
            <Input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mr-2"
            />
            {isLoading && (
              <div role="status" className="my-auto -ml-10">
                <svg
                  aria-hidden="true"
                  className="size-4 animate-spin fill-black text-gray-200 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            )}
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

function BookDialog({ item }: { item: Book }) {
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
