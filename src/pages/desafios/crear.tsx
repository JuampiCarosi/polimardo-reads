import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { type BookRaw } from "../api/books/[id]";
import search from "../api/books/search";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { CommandItem } from "@/components/ui/command";
import { LoadingSpinner } from "@/components/loading-spinner";
import axios from "axios";
import { toast } from "sonner";
import router from "next/router";
import { MultipleBookSelector } from "@/components/books-selector";

export default function PostNewChallenge() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="min-h-screen bg-slate-100">
        <Header />
        <div className="position-relative mx-auto mt-14 items-center">
          {session && <ChallengeCreationForm user={session.user} />}
        </div>
      </div>
    </div>
  );
}

function ChallengeCreationForm({ user }: { user: Session["user"] }) {
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [search, setSearch] = useState<string>("");
  const { data } = useQuery<BookRaw[]>({
    queryKey: ["books", "search", `?q=${search}&filter=all`],
  });
  const [challengeBooks, setChallengeBooks] = useState<Array<string>>([]);

  const handleSubmit = async () => {
    const challengeData = {
      title,
      description,
      startDate,
      endDate,
      createdBy: user.id,
      books: challengeBooks,
    };
    try {
      const res = await axios.post("/api/challenges", challengeData);
      if (res.status != 201) {
        throw new Error();
      }
      await axios.post("/api/challenges/join", {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        challengeId: res.data[0].id,
        userId: user.id,
      });
      toast.success("Desafío creado correctamente");
      await router.push("/desafios");
    } catch (err) {
      console.error(err);
      toast.error(
        "Error al crear el desafío. Asegurate de llenar todos los campos correctamente.",
      );
    }
  };

  return (
    <Card className="mx-auto max-w-2xl pb-10 pl-10 pr-10 pt-10">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div>
            <CardTitle className="text-2xl">Creá tu desafío</CardTitle>
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
              value={startDate ?? undefined}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className={cn("pl-10", "text-slate-600")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">Fecha de fin </Label>
            <Input
              id="end_date"
              value={endDate ?? undefined}
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
            Guardar Cambios
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
