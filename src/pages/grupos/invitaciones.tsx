import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, MessageSquare } from "lucide-react";
import { Header } from "@/components/header";
import { useQuery } from "react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import type { Invitation } from "../api/groups/invitations";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";

export default function Component() {
  const [search, setSearch] = useState("");

  const pendingGroups = useQuery<Invitation[]>({
    queryKey: ["groups", "invitations"],
  });

  const handleAccept = async (id: string) => {
    const response = await fetch("/api/groups", {
      method: "PATCH",
      body: JSON.stringify({ id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast.error("Error al aceptar la solicitud de grupo");
      console.error(await response.json());
      return;
    }

    toast.success("Solicitud de grupo aceptada");
    void pendingGroups.refetch();
  };

  const handleDecline = async (id: string) => {
    const response = await fetch("/api/groups", {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast.error("Error al rechazar la solicitud de grupo");
      console.error(await response.json());
      return;
    }

    toast.success("Solicitud de grupo rechazada");
    void pendingGroups.refetch();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="position-relative mx-auto mt-14 items-center">
        <Card className="mx-auto w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              Invitaciones a Grupos Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
                placeholder="Buscar grupos"
              />
              <ScrollArea className="h-[400px] pr-4">
                {pendingGroups.data && pendingGroups.data.length > 0 ? (
                  <div className="space-y-4">
                    {pendingGroups.data.map((invitation) => (
                      <Card key={invitation.id}>
                        <CardContent className="flex items-center justify-between p-6">
                          <div className="flex flex-grow items-center space-x-4">
                            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {invitation.title.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-medium">
                                {invitation.title}
                              </h3>
                              <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                                <span className="flex items-center">
                                  <Users className="mr-1 h-4 w-4" />
                                  {invitation.member_count} members
                                </span>
                                <span className="flex items-center">
                                  <MessageSquare className="mr-1 h-4 w-4" />
                                  {invitation.discussions_count} discussions
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-6 flex space-x-2">
                            <Button
                              variant="destructive"
                              onClick={() => handleDecline(invitation.id)}
                            >
                              Rechazar
                            </Button>
                            <Button onClick={() => handleAccept(invitation.id)}>
                              Aceptar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground py-8 text-center">
                    No tienes invitaciones a grupos pendientes.
                  </div>
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const getServerSideProps = getServerSidePropsWithAuth();
