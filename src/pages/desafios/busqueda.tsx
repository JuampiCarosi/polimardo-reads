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
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import { LoadingSpinner } from "@/components/loading-spinner";
import { type GeneralChallengeData } from "../api/challenges/search";
import { Button } from "@/components/ui/button";
import router from "next/router";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";

export default function Page() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery<GeneralChallengeData[]>({
    queryKey: ["challenges", "search", `?q=${search}`],
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <Card className="mx-auto mt-4 w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Buscar Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex">
            <Input
              placeholder="Buscar desafios..."
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
                <TableHead>Titulo</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead>Cantidad de participantes</TableHead>
                <TableHead>Cantidad de libros</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item) => (
                // <ChallengeDialog key={item.challenge_id} item={item} />
                <>
                  <TableRow>
                    <TableCell>{item.challenge_name}</TableCell>
                    <TableCell>{item.challenge_description}</TableCell>
                    <TableCell>{item.participant_count}</TableCell>
                    <TableCell>{item.book_ids.length}</TableCell>
                    <TableCell className="pl-10">
                      <Button
                        onClick={async () => {
                          await queryClient.prefetchQuery(
                            ["challenges", item.challenge_id],
                            () =>
                              fetch(
                                `/api/challenges/${item.challenge_id}`,
                              ).then((res) => res.json()),
                          );
                          void router.push(`/desafios/${item.challenge_id}`);
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
              No se encontraron desafios...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth();
