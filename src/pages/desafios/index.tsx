import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "react-query";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { type MyChallenges } from "../api/challenges/index";
import { Progress } from "@/components/ui/progress";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";
import router from "next/router";

export default function Desafios() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { data: myChallenges } = useQuery<MyChallenges[]>({
    queryKey: ["challenges?user=" + userId],
    enabled: userId != undefined,
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="min-h-screen bg-slate-50">
        <main className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-3xl font-bold text-slate-800">Desafíos</h1>
          <div className="flex justify-end py-4">
            <Button size="sm" asChild>
              <Link href="/desafios/crear?mode=create">Crear Desafío</Link>
            </Button>
          </div>
          <Card className="border-slate-200 bg-white">
            <CardContent className="sm:p-8 lg:p-10">
              <div className="mb-6 flex items-center justify-between px-6">
                <h2 className="text-2xl font-semibold text-slate-800">
                  Mis Desafíos
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:gap-8">
                {myChallenges?.length === 0 && (
                  <div className="col-span-2 w-full pt-2 text-center text-sm font-medium text-slate-500">
                    No estas participando de ningun desafío
                  </div>
                )}
                {myChallenges?.map((challenge) => (
                  <Card
                    key={challenge.id}
                    className="cursor-pointer border-slate-200 bg-white hover:shadow-lg"
                    onClick={async () => {
                      await router.push(`/desafios/${challenge.id}`);
                    }}
                  >
                    <CardContent className="sm:p-8 lg:p-10">
                      <div className="r flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800">
                          {challenge.name}
                        </h3>
                        <Badge>
                          {challenge.participants}{" "}
                          {challenge.participants > 1
                            ? "Participantes"
                            : "Participante"}
                        </Badge>
                      </div>
                      <div className="mt-4 break-words text-sm">
                        <p className="text-slate-600">
                          {challenge.description}
                        </p>
                      </div>
                      <div className="mt-6">
                        <Progress
                          value={
                            (challenge.books_read.length * 100) /
                            challenge.book_ids.length
                          }
                        />
                        {challenge.books_read.length /
                          challenge.book_ids.length ===
                          1 && <Badge>Desafío completado</Badge>}
                        <p className="mt-2 text-slate-600">
                          {challenge.books_read.length} de{" "}
                          {challenge.book_ids.length}{" "}
                          {challenge.book_ids.length > 1
                            ? "libros leídos"
                            : "libro leído"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth();
