import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { type Genres } from "./api/books/genres";
import { useQuery } from "react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import { type Session } from "next-auth";
import { useRouter } from "next/router";
import { GenresSelector } from "@/components/genres-selector";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";

function Form({ user }: { user: Session["user"] }) {
  const { data: all_genres } = useQuery<Genres[]>({
    queryKey: ["books", "genres"],
  });
  const router = useRouter();
  const [title, setTitle] = useState<string>();
  const [series, setSeries] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [language, setLanguage] = useState<string>();
  const [isbn, setIsbn] = useState<string>();
  const [cover_img, setCoverImg] = useState<string>();
  const [publish_year, setPublishYear] = useState<string>();
  const [genres, setGenres] = useState<Array<string>>([]);
  const [publisher, setPublisher] = useState<string>();

  const handleSubmit = async () => {
    const genresToSend =
      all_genres
        ?.filter((genre) => genres?.some((selected) => selected === genre.name))
        ?.map((genre) => genre.name) ?? [];

    const book = {
      title,
      series,
      description,
      language,
      isbn,
      cover_img,
      author: user.name,
      publish_year: publish_year
        ? new Date(publish_year).getFullYear()
        : undefined,
      genres: JSON.stringify(genresToSend),
      publisher,
    };
    try {
      await axios.post("/api/books", book);
      toast.success("Libro publicado correctamente");
      await router.push("/");
    } catch (err) {
      console.error(err);
      toast.error(
        "Error al publicar libro. Asegurate de llenar todos los campos correctamente.",
      );
    }
  };

  return (
    <Card className="mx-auto max-w-2xl pb-10 pl-10 pr-10 pt-10">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div>
            <CardTitle className="text-2xl">Publicá tu libro</CardTitle>
            <CardDescription>Agregá los datos de tu libro</CardDescription>
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="series">Nombre de colección</Label>
            <Input
              id="series"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publisher">Editorial</Label>
            <Input
              id="publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select value={language ?? undefined} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Seleccionar idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">Inglés</SelectItem>
                <SelectItem value="Spanish">Español</SelectItem>
                <SelectItem value="Portuguese">Portugués</SelectItem>
                <SelectItem value="Japanese">Japonés</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cover_img">URL de la portada</Label>
            <Input
              id="cover_img"
              value={cover_img ?? undefined}
              onChange={(e) => setCoverImg(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publish_year">Año de publicación</Label>
            <Input
              id="publish_year"
              value={publish_year ?? undefined}
              onChange={(e) => setPublishYear(e.target.value)}
              type="date"
              className={cn("pl-10", "text-slate-600")}
            />
          </div>
        </div>

        <div className="max-w-xl p-4">
          <Label htmlFor="publish_year">Elegí los géneros de tu libro</Label>

          <GenresSelector genres={genres} setGenres={setGenres} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Guardar Cambios
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function PostNewBook() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="min-h-screen bg-slate-100">
        <Header />
        <div className="position-relative mx-auto mt-14 items-center">
          {session && <Form user={session.user} />}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth(async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session?.user.role !== "author") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
});
