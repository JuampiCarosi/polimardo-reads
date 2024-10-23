import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DialogHeader } from "@/components/ui/dialog";
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
import { useState } from "react";
import { useQuery } from "react-query";
import { type Books } from "./api/books/search";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import router from "next/router";
import Link from "next/link";

export default function Page() {
  const [search, setSearch] = useState("");
  const session = useSession();

  const { data } = useQuery<Books>({
    queryKey: ["books", `search/?book=${search}`],
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex h-[70px] items-center justify-between bg-slate-800 px-4 py-4 text-slate-200 shadow shadow-slate-200">
        <div className="flex items-center gap-7">
          <Link href="/" className="text-xl font-semibold">
            Polimardo Reads
          </Link>
          <div className="space-x-3 font-medium">
            <Link className="hover:underline" href="/">
              Home
            </Link>
            <Link className="hover:underline" href="/busqueda">
              Buscar
            </Link>
          </div>
        </div>

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
              <DropdownMenuCheckboxItem onClick={() => router.push("/perfil")}>
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
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <TableRow
                      className="cursor-pointer"
                      // onClick={() => router.push(`/libro/${item.id}`)}
                    >
                      <TableCell>
                        {item.cover_img && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.cover_img}
                            alt={item.title}
                            className="h-14 w-14"
                          />
                        )}
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.author}</TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                      <DialogDescription>
                        by {item.author} #{item.isbn}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-start gap-4 pt-2">
                      {item.cover_img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt={item.title}
                          src={item.cover_img}
                          className="size-56 rounded-lg border"
                        />
                      )}
                      <p className="text-sm text-slate-800">
                        {item.description}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
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
