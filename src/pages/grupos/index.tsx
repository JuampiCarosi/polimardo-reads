import { Header } from "@/components/header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { type Group } from "../api/groups";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FriendsSelector } from "@/components/friends-selector";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";

export default function Grupos() {
  const [search, setSearch] = useState("");

  const { data: groups } = useQuery<Group[]>({
    queryKey: ["groups"],
  });

  const filteredGroups = groups?.filter((group) =>
    group.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="mx-auto mt-3 max-w-6xl space-y-4">
        <BreadCrumbs />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold">Mis grupos</CardTitle>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
                placeholder="Buscar grupos"
              />
            </div>
            <CreateGroupDialog />
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGroups?.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GroupCard({ group }: { group: Group }) {
  return (
    <Card className="hover:bg-slate-50">
      <Link href={`/grupos/${group.id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">{group.title}</CardTitle>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{group.title.charAt(0)}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 text-sm text-slate-600">
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              {group.member_count} miembros
            </div>
            <div className="flex items-center">
              <MessageSquareText className="mr-1 h-4 w-4" />
              {group.discussions_count} discusiones
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

function CreateGroupDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const queryClient = useQueryClient();
  async function handleCreateGroup() {
    if (title.length < 3) {
      toast.error("El título debe tener al menos 3 caracteres");
      return;
    }
    setOpen(false);

    const res = await fetch("/api/groups", {
      method: "POST",
      body: JSON.stringify({ title, members }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      toast.success("Grupo creado exitosamente");
    } else {
      toast.error("Error creando grupo");
    }
    void queryClient.invalidateQueries(["groups"]);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Crear grupo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Crear grupo</DialogTitle>
        <div className="space-y-1">
          <Label className="text-base" htmlFor="title">
            Título
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del grupo"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <Label className="text-base" htmlFor="title">
            Miembros
          </Label>
          <FriendsSelector
            friends={members}
            setFriends={setMembers}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleCreateGroup}>Crear grupo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BreadCrumbs() {
  return (
    <Breadcrumb className="pl-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Mis Grupos</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth();
