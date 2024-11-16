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
import router from "next/router";
import { MultipleBookSelector } from "@/components/books-selector";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";
import type { Challenge } from "../api/challenges/[id]";
import { useQuery } from "react-query";

function ChallengeForm({
  user,
  mode,
  initialId,
}: {
  user: Session["user"];
  mode?: string;
  initialId?: string;
}) {
  const { data: initialData } = useQuery<Challenge>({
    queryKey: ["challenges", initialId],
    enabled: typeof initialId === "string",
  });
  const [title, setTitle] = useState<string>(initialData?.name ?? "");
  const [description, setDescription] = useState<string>(
    initialData?.description ?? "",
  );
  const [startDate, setStartDate] = useState<string>(
    initialData?.start_date ?? "",
  );
  const [endDate, setEndDate] = useState<string>(initialData?.end_date ?? "");
  const [challengeBooks, setChallengeBooks] = useState<Array<string>>(
    initialData?.book_ids ?? [],
  );

  const handleSubmit = async () => {
    const challengeData = {
      id: initialId,
      name: title,
      description,
      startDate,
      endDate,
      createdBy: user.id,
      books: challengeBooks,
    };

    try {
      if (mode === "create") {
        const res = await axios.post("/api/challenges", challengeData);
        if (res.status != 201) {
          throw new Error();
        }
        await axios.post("/api/challenges/participants", {
          challengeId: (res.data as { id: string }[])[0]?.id,
          userId: user.id,
        });
        toast.success("Desafío creado correctamente");
      } else if (mode === "edit") {
        await axios.put(`/api/challenges/${initialId}`, challengeData);
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
  const mode = router.query.mode as string;
  const challengeId = router.query.challengeId as string;

  return (
    <div>
      <div className="min-h-screen bg-slate-100">
        <Header />
        <div className="position-relative mx-auto mt-14 items-center">
          {session && (
            <ChallengeForm
              user={session.user}
              mode={mode}
              initialId={challengeId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth();
