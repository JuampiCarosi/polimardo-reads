import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useQuery } from "react-query";
import { type Genres } from "../api/books/genres";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GenresSelector } from "@/components/genres-selector";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/router";
import { Label } from "@/components/ui/label";
import { type ListDetailed } from "../api/lists/[id]";
import { Textarea } from "@/components/ui/textarea";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";

export default function Listas() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const { data } = useQuery<Genres[]>({
    queryKey: ["books", "mainGenres"],
  });

  const { data: featured } = useQuery<ListDetailed>({
    queryKey: ["lists", "featured"],
  });

  const handleSubmit = async () => {
    if (title.length === 0 || description.length === 0 || genres.length === 0) {
      toast.error("Por favor llene todos los campos");
      return;
    }

    const list = {
      title,
      description,
      genres,
    };

    const response = await fetch(`/api/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(list),
    });
    if (!response.ok) {
      console.error(response);
      toast.error("Error al crear la lista");
      return;
    }

    toast.success("Lista creada correctamente");
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="min-h-screen bg-slate-50">
        <main className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-3xl font-bold text-slate-800">Listardas</h1>

          <div className="flex items-center justify-between">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await router.push("/listas/busqueda?search=" + searchQuery);
                }}
              >
                <Input
                  className="w-full max-w-xl border-slate-200 bg-white pl-9 focus:border-slate-400 focus:ring-slate-400"
                  placeholder="Search tags"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            <div>
              <Dialog modal={false} open={open} onOpenChange={setOpen}>
                <div
                  className={
                    open
                      ? "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
                      : "hidden"
                  }
                />
                <DialogTrigger asChild>
                  <Button size="sm">Crear nueva lista</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Lista</DialogTitle>
                    <DialogDescription>
                      Añade un nombre, una descripción y etiquetas para tu
                      lista.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Label
                      className="text-sm font-semibold text-slate-800"
                      htmlFor="title"
                    >
                      Título
                    </Label>
                    <Input
                      className="w-full"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label
                      className="text-sm font-semibold text-slate-800"
                      htmlFor="description"
                    >
                      Descripción
                    </Label>
                    <Textarea
                      className="w-full"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label
                      className="text-sm font-semibold text-slate-800"
                      htmlFor="genres"
                    >
                      Tags
                    </Label>
                    <GenresSelector
                      className="w-full"
                      genres={genres}
                      setGenres={setGenres}
                      valuesClassName="max-w-[400px]"
                    />
                  </div>
                  <Button onClick={async () => await handleSubmit()}>
                    Crear Lista
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="my-6 flex flex-wrap gap-2">
            {data?.slice(0, 12)?.map((genre) => (
              <Badge
                key={genre.id}
                variant="secondary"
                className="cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-300"
                onClick={() =>
                  void router.push(`/listas/busqueda?search=${genre.name}`)
                }
              >
                {genre.name}
              </Badge>
            ))}
          </div>
          {/* <Tabs defaultValue="featured" className="space-y-6">
            <TabsList className="bg-slate-100 text-slate-600">
              <TabsTrigger value="featured">Featured Lists</TabsTrigger>
              <TabsTrigger value="created">Lists I Created</TabsTrigger>
              <TabsTrigger value="voted">Lists I have Voted On</TabsTrigger>
              <TabsTrigger value="liked">Lists I have Liked</TabsTrigger>
            </TabsList> */}

          {/* <TabsContent value="featured"> */}
          <Card className="border-slate-200 bg-white">
            <CardContent className="sm:p-8 lg:p-10">
              <div className="mb-6 flex items-center justify-between px-6">
                <h2 className="text-2xl font-semibold text-slate-800">
                  Listas populares
                </h2>
              </div>
              <div
                onClick={() => router.push(`/listas/${featured?.id}`)}
                className="cursor-pointer px-6 py-2 hover:bg-slate-100/90"
              >
                <h3 className="mb-2 text-xl font-semibold text-slate-800">
                  {featured?.name}
                </h3>
                <p className="mb-6 text-sm text-slate-500">
                  {featured?.books_count} libros · {featured?.users_count}{" "}
                  votantes
                </p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                  {featured?.books.map((book) => (
                    <div key={book.id} className="space-y-3">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                        <Image
                          src={book.cover_img}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium leading-none text-slate-800">
                          {book.title}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {book.author}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* </TabsContent> */}

          {/* <TabsContent value="created">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-2xl font-semibold text-slate-800">
                    Lists I Created
                  </h2>
                  <p className="text-slate-600">
                    This section would display the lists you have created.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voted">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-2xl font-semibold text-slate-800">
                    Lists I have Voted On
                  </h2>
                  <p className="text-slate-600">
                    This section would show the lists you have voted on.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="liked">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-2xl font-semibold text-slate-800">
                    Lists I have Liked
                  </h2>
                  <p className="text-slate-600">
                    Here you would see the lists you have liked.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs> */}
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth();
