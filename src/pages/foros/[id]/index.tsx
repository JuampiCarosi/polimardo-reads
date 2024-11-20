import { Header } from "@/components/header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { use, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { FriendsSelector } from "@/components/friends-selector";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";
import { ForumInfo } from "@/pages/api/forums/[id]";
import { Pill } from "@/components/pill";
import { useSession } from "next-auth/react";

export default function Forum() {
  const { query } = useRouter();
  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const userId = useSession().data?.user.id;

  const { data } = useQuery<ForumInfo>({
    queryKey: ["forums", query.id as string],
    enabled: typeof query.id === "string",
  });


  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="mx-auto mt-3 max-w-6xl space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold">{data?.name}</CardTitle>
              <Pill
              color={data?.status === true ? "green" : "red"}>
                {data?.status === true ? "Abierto" : "Cerrado"}
              </Pill>
            </div>
            {data?.created_by == userId && (<div className="flex justify-end">
              <Button
              onClick={
                async () => {
                  if (typeof query.id === "string") {
                    const res = await fetch(`/api/forums/${query.id}/status`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ status: !data?.status }),
                    });
                    if (res.ok) {
                      toast.success("Foro actualizado");
                    } else {
                      toast.error("Error actualizando foro");
                    }
                  }
                  void queryClient.invalidateQueries(["forums", query.id as string]);
                }
              }
              >
                {data?.status === true ? "Cerrar foro" : "Abrir foro"}
              </Button>

            </div>)}
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="discussions"
              className="space-y-4"
            >
              <TabsContent value="discussions" className="space-y-4">
                {data?.discussions?.length === 0 && (
                  <div className="w-full text-center text-sm font-medium text-slate-500">
                    No hay discusiones en este foro.
                  </div>
                )}
                {data?.discussions?.map((discussion) => (
                  <Card className="hover:bg-slate-50" key={discussion.id}>
                    <Link
                      href={`/foros/${query.id as string}/discusiones/${discussion.id}`}
                      key={discussion.id}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">
                          {discussion.title}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-800"
                        >
                          <MessageSquare className="mr-1 h-4 w-4" />
                          {discussion.comments_count} respuestas
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        {/* Quizas podria ir la persona q abrio la discusion en vez d esto fake xd  */}
                        <p className="text-sm text-slate-600">
                          Última actividad: {new Date().toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Link>
                  </Card>
                ))}

                {data?.status && <CreateDiscussionDialog />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CreateDiscussionDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useRouter().query;

  const queryClient = useQueryClient();
  async function handleCreateDiscussion() {
    if (typeof id !== "string") {
      toast.error("Foro no encontrado");
      return;
    }

    if (title.length < 3) {
      toast.error("El título debe tener al menos 3 caracteres");
      return;
    }
    setOpen(false);

    const res = await fetch(`/api/forums/${id}/discussions`, {
      method: "POST",
      body: JSON.stringify({ title, description, forum_id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      toast.success("Discusion creada exitosamente");
    } else {
      toast.error("Error creando discusion");
    }

    void queryClient.invalidateQueries(["forums", id]);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-slate-800 hover:bg-slate-700">
          Crear nueva discusión
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Crear Discusión</DialogTitle>
        <div className="space-y-1">
          <Label className="text-base" htmlFor="title">
            Título
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la discusión"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <Label className="text-base" htmlFor="title">
            Descripcion
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción de la discusión"
          />
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleCreateDiscussion}>Crear discusion</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth();
