import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { MultipleBookSelector } from "@/components/books-selector";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";
import type { Challenge } from "../api/challenges/[id]";
import { useQuery } from "react-query";
import { type BookRaw } from "../api/books/[id]";

function ChallengeForm({
  user,
  mode,
  challenge,
}: {
  user: Session["user"];
  challenge?: Challenge;
  mode: "create" | "edit";
}) {
  const router = useRouter();

  const [title, setTitle] = useState<string | undefined>(challenge?.name);
  const [description, setDescription] = useState<string | undefined>(
    challenge?.description,
  );
  const [startDate, setStartDate] = useState<string | undefined>(
    challenge?.start_date,
  );
  const [endDate, setEndDate] = useState<string | undefined>(
    challenge?.end_date,
  );
  const [challengeBooks, setChallengeBooks] = useState<BookRaw[]>(
    challenge?.books ?? [],
  );

  const handleSubmit = async () => {
    try {
      if (mode === "create") {
        const challengeData = {
          title,
          description,
          startDate,
          endDate,
          createdBy: user.id,
          books: challengeBooks.map((book) => book.id),
        };

        const res = await axios.post("/api/challenges", challengeData);
        if (res.status != 201) {
          throw new Error();
        }
        await axios.post("/api/challenges/participants", {
          challengeId: (res.data as { id: string }[])[0]?.id,
          userId: user.id,
        });
        toast.success("Desafío creado correctamente");
      } else if (mode === "edit" && challenge) {
        const challengeData = {
          id: challenge.id,
          name: title,
          description,
          startDate,
          endDate,
          createdBy: user.id,
          books: challengeBooks.map((book) => book.id),
        };

        await axios.put(`/api/challenges/${challenge.id}`, challengeData);
        toast.success("Desafío actualizado correctamente");
      }
      await router.push("/desafios");
    } catch (err) {
      console.error(err);
      toast.error(
        "Error al guardar el desafío. Asegúrate de llenar todos los campos correctamente.",
      );
    }
  };

  return (
    <Card className="mx-auto max-w-2xl pb-10 pl-10 pr-10 pt-10">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div>
            <CardTitle className="text-2xl">
              {mode === "create" ? "Creá tu desafío" : "Editá tu desafío"}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descripción </Label>
          <Textarea
            id="description"
            placeholder="Explicá de qué se trata el desafío y agregá cualquier otra información que los participantes puedan necesitar."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="start_date">Fecha de comienzo </Label>
            <Input
              id="start_date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className={cn("pl-10", "text-slate-600")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">Fecha de fin </Label>
            <Input
              id="end_date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className={cn("pl-10", "text-slate-600")}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Libros del Desafío</Label>
          <MultipleBookSelector
            value={challengeBooks}
            setValue={setChallengeBooks}
          />
        </div>

        <CardFooter>
          <Button className="w-full" onClick={handleSubmit}>
            {mode === "create" ? "Crear Desafío" : "Guardar Cambios"}
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

export default function ChallengePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const mode = router.query.mode as "create" | "edit";
  const challengeId = router.query.challengeId as string;

  const { data: challenge } = useQuery<Challenge>({
    queryKey: ["challenges", challengeId],
    enabled: typeof challengeId === "string",
  });

  return (
    <div>
      <div className="min-h-screen bg-slate-100">
        <Header />
        <div className="position-relative mx-auto mt-14 items-center">
          {session &&
            (mode === "create" ? (
              <ChallengeForm user={session.user} mode={mode} />
            ) : (
              challenge && (
                <ChallengeForm
                  user={session.user}
                  mode={mode}
                  challenge={challenge}
                />
              )
            ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth();
