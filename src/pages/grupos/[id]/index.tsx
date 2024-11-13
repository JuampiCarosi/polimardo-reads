import { Header } from "@/components/header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { type GroupInfo } from "../../api/groups/[id]";
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

export default function Group() {
  const [activeTab, setActiveTab] = useState("discussions");
  const { query } = useRouter();

  const { data } = useQuery<GroupInfo>({
    queryKey: ["groups", query.id as string],
    enabled: typeof query.id === "string",
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="mx-auto mt-3 max-w-6xl space-y-4">
        {<BreadCrumbs group={data} />}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold">{data?.title}</CardTitle>
              <div className="flex space-x-4 pt-2">
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-800"
                >
                  <Users className="mr-1 h-4 w-4" />
                  {data?.members?.length} miembros
                </Badge>
              </div>
            </div>
            <AddFriendDialog currentMembers={data?.members?.map((m) => m.id)} />
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              defaultValue="discussions"
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger
                  value="discussions"
                  onClick={() => setActiveTab("discussions")}
                >
                  Discusiones
                </TabsTrigger>
                <TabsTrigger
                  value="members"
                  onClick={() => setActiveTab("members")}
                >
                  Miembros
                </TabsTrigger>
              </TabsList>
              <TabsContent value="discussions" className="space-y-4">
                {data?.discussions?.length === 0 && (
                  <div className="w-full text-center text-sm font-medium text-slate-500">
                    No hay discusiones en este grupo.
                  </div>
                )}
                {data?.discussions?.map((discussion) => (
                  <Card className="hover:bg-slate-50" key={discussion.id}>
                    <Link
                      href={`/grupos/${query.id as string}/discusiones/${discussion.id}`}
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
                        <p className="text-sm text-slate-600">
                          Última actividad: {new Date().toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Link>
                  </Card>
                ))}

                <CreateDiscussionDialog />
              </TabsContent>
              <TabsContent value="members" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3">
                  {data?.members?.map((member) => (
                    <Link
                      href={`/perfil/${member.id}`}
                      key={member.id}
                      className={cn(
                        "flex items-center space-x-2 rounded-md px-4 py-2 hover:bg-slate-100",
                        !member.has_accepted && "opacity-60",
                      )}
                    >
                      <Avatar>
                        <AvatarImage
                          src={member.image ?? undefined}
                          alt={member.name ?? member.email ?? ""}
                        />
                        <AvatarFallback>
                          {member?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start gap-1">
                        <div className={cn("text-sm font-medium")}>
                          {member.name}
                        </div>
                        {!member.has_accepted && (
                          <Badge
                            variant="secondary"
                            className="px-1 py-0 text-[0.7rem]"
                          >
                            Pendiente
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
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
      toast.error("Grupo no encontrado");
      return;
    }

    if (title.length < 3) {
      toast.error("El título debe tener al menos 3 caracteres");
      return;
    }
    setOpen(false);

    const res = await fetch("/api/groups/discussions", {
      method: "POST",
      body: JSON.stringify({ title, description, group_id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      toast.success("Discusion creada exitosamente");
    } else {
      toast.error("Error creando discusion");
    }

    void queryClient.invalidateQueries(["groups", id]);
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

function AddFriendDialog({
  currentMembers,
}: {
  currentMembers: string[] | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<string[]>([]);
  const { id } = useRouter().query;
  const queryClient = useQueryClient();
  async function handleCreateGroup() {
    if (typeof id !== "string") {
      toast.error("Grupo no encontrado");
      return;
    }
    setOpen(false);

    const res = await fetch(`/api/groups/${id}/members`, {
      method: "PUT",
      body: JSON.stringify({ members }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      toast.success("Integrantes invitados exitosamente");
    } else {
      toast.error("Error invitando integrantes");
    }
    void queryClient.invalidateQueries(["groups"]);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button> Agregar miembro</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Invitar miembros</DialogTitle>
        <DialogDescription>
          Se les enviara una invitacion a cada uno
        </DialogDescription>

        <div className="flex flex-col space-y-1">
          <Label className="text-base" htmlFor="title">
            Miembros
          </Label>
          <FriendsSelector
            exclude={currentMembers}
            friends={members}
            setFriends={setMembers}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleCreateGroup}>Enviar invitaciones</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BreadCrumbs({ group }: { group: GroupInfo | undefined }) {
  return (
    <Breadcrumb className="pl-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/grupos">Mis Grupos</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{group?.title ?? ""}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
