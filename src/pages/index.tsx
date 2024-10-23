import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { type Books } from "./api/books/search";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const session = useSession();

  const [search, setSearch] = useState("");

  const { data } = useQuery<Books[]>({
    queryKey: ["books", `search/?book=${search}`],
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <Head>
        <title>Polimardo Reads</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-slate-100">
        <div className="flex items-center justify-between bg-slate-800 px-4 py-4 text-slate-200 shadow shadow-slate-200 h-[70px]">
          <h1 className="text-xl font-semibold">Polimardo Reads</h1>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={session.data?.user.image ?? undefined}
                    alt={session.data?.user.name ?? undefined}
                  />
                  <AvatarFallback>{session.data?.user.name}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem
                  onClick={() => router.push("/perfil")}
                >
                  Editar perfil
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem onClick={() => signOut()}>
                  Cerrar sesión
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

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
                {data?.map((item) => (
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => router.push(`/libro/${item.id}`)}
                    key={item.id}
                  >
                    <TableCell>
                      {item.image_url_3 && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url_3}
                          alt={item.book_title}
                          className="h-14 w-14"
                        />
                      )}
                    </TableCell>
                    <TableCell>{item.book_title}</TableCell>
                    <TableCell>{item.book_author}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data?.length === 0 && (
              <p className="mt-4 text-center text-gray-500">No results found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
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
