import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import { Header } from "@/components/header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import router from "next/router";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";
import { type ForumSearch } from "../api/forums/search";
import { Pill } from "@/components/pill";

export default function Page() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery<ForumSearch[]>({
    queryKey: ["forums", "search", `?q=${search}`],
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <Card className="mx-auto mt-4 w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Buscar Foros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex">
            <Input
              placeholder="Buscar foros..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mr-2"
            />
            {isLoading && (
              <div role="status" className="my-auto -ml-10">
                <LoadingSpinner />
              </div>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Creado por</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Discusiones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item) => (
                <>
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.created_by}</TableCell>

                    <TableCell>
                      <Pill
                        className="px-2 py-1"
                        color={item.status === true ? "green" : "red"}
                      >
                        {item.status === true ? "Abierto" : "Cerrado"}
                      </Pill>
                    </TableCell>
                    <TableCell>{item.discussions}</TableCell>
                    <TableCell className="pl-10">
                      <Button
                        onClick={async () => {
                          await queryClient.prefetchQuery(
                            ["forums", item.id],
                            () =>
                              fetch(`/api/forums/${item.id}`).then((res) =>
                                res.json(),
                              ),
                          );
                          void router.push(`/foros/${item.id}`);
                        }}
                      >
                        Ver más
                      </Button>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
          {data?.length === 0 && (
            <p className="mt-4 text-center text-gray-500">
              No se encontraron foros...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth();
