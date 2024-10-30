import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery, useQueryClient } from "react-query";
import { type Book } from "./api/books/[id]";
import Head from "next/head";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import Image from "next/image";
import { supabase } from "@/server/supabase";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { BookRaw } from "./api/books/[id]";
import { Button } from "@/components/ui/button";
import router from "next/router";



export default function Home() {
  const { data } = useQuery<Book[]>({
    queryKey: ["books", "recommended"],
  });
  
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
        <Card className="mx-auto mt-4 w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Recomendados en base a tus preferencias</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Titulo</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Géneros</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item) => <BookDialog key={item.isbn} item={item} />)}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function BookDialog({ item }: { item: BookRaw }) {
  const queryClient = useQueryClient();

  return (
    <Dialog key={item.id}>
      <DialogTrigger asChild>
        <TableRow className="cursor-pointer">
          <TableCell>
            <Image
              src={item.cover_img ?? "/default-cover.png"}
              alt={item.title}
              width={40}
              height={40}
            />
          </TableCell>
          <TableCell>{item.title}</TableCell>
          <TableCell>{item.author}</TableCell>
          <TableCell>{item.genres.replace(/[\[\]']/g, '')}</TableCell>
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

  if (!session.user.onboarding_completed) {
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
};
