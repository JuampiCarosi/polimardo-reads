import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function PostNewChallenge() {
    const { data: session } = useSession();

    return (
        <div>
          <div className="min-h-screen  bg-slate-100">
          <Header />
            <div className="position-relative mx-auto mt-14 items-center">
            {session && <ChallengeCreationForm user={session.user} />}
            </div>
          </div>
        </div>
      );
}

function ChallengeCreationForm({user}: {user: Session["user"]}) {
    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const [search, setSearch] = useState<string>("");
    const {data} = useQuery<BookRaw[]>({
        queryKey: ["books", "search", `?q=${search}&filter=all`],
      });
    const [challengeBooks, setChallengeBooks] = useState<Array<BookRaw>>([])

    const handleSubmit = async () => {
        const books = challengeBooks.map((book) => book.id)
        const challengeData = {
            title,
            description,
            startDate,
            endDate,
            createdBy: user.id,
            books
        }
        try {
            await axios.post("/api/challenges", challengeData);
            toast.success("Libro publicado correctamente");
            await router.push("/desafios");
          } catch (err) {
            console.error(err);
            toast.error(
              "Error al crear el desafío. Asegurate de llenar todos los campos correctamente.",
            );
          }
    }

    return (
        <Card className="mx-auto max-w-2xl pb-10 pl-10 pr-10 pt-10 ">
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <div>
                        <CardTitle className="text-2xl">Creá tu desafío</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name" >Título</Label>
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
                <div className="space-y-2">
                    <Label>Libros del Desafío</Label>
                    {challengeBooks.map((book) => (
                        <div key={book.id}>
                            <div
                                className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-slate-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={book.cover_img ?? undefined}
                                            width={56}
                                            height={56} />
                                        <AvatarFallback>
                                            {book.title}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-sm">{book.title}</div>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        if (challengeBooks.includes(book)) {
                                            setChallengeBooks(challengeBooks.filter((g) => g !== book));
                                        }
                                    }}
                                    variant="destructive"
                                >
                                    Quitar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <div className="relative">
                        <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
                        <Input
                            placeholder="Buscá libros por título, género o autor"
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {data?.map((book) => (
                        <div key={book.id}>
                            <div
                                className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={book.cover_img ?? undefined}
                                            width={56}
                                            height={56} />
                                        <AvatarFallback>
                                            {book.title}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">{book.title}</div>
                                        <div className="text-slate-700 text-xs">{book.author.slice(0, 60)}</div>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        if (challengeBooks.includes(book)) {
                                            setChallengeBooks(challengeBooks.filter((g) => g !== book));
                                        } else {
                                            setChallengeBooks([...challengeBooks, book]);
                                        }
                                        setSearch("");

                                    }}
                                    variant={challengeBooks.includes(book) ? "destructive" : "default"}
                                >
                                    {challengeBooks.includes(book) ? "Quitar" : "Agregar"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <CardFooter>
                    <Button className="w-full"
                    onClick={handleSubmit}>
                        Guardar Cambios
                    </Button>
                </CardFooter>
            </CardContent>
        </Card>
    );
}