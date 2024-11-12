import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, MessageSquare } from "lucide-react";
import { Header } from "@/components/header";
import { useQuery } from "react-query";

interface Group {
  id: string;
  title: string;
  member_count: number;
  discussions_count: number;
}

interface GroupInvitation {
  id: string;
  group: Group;
}

export default function Component() {
  const [search, setSearch] = useState("");

  const invitations = useQuery<GroupInvitation[]>({
    queryKey: ["groupInvitations"],
  });

  const handleAccept = (invitationId: string) => {
    setInvitations((current) =>
      current.filter((inv) => inv.id !== invitationId),
    );
  };

  const handleDecline = (invitationId: string) => {
    setInvitations((current) =>
      current.filter((inv) => inv.id !== invitationId),
    );
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
                {invitations.length > 0 ? (
                  <div className="space-y-4">
                    {invitations.map((invitation) => (
                      <Card key={invitation.id}>
                        <CardContent className="flex items-center justify-between p-6">
                          <div className="flex flex-grow items-center space-x-4">
                            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                              {invitation.group.avatar ? (
                                <Image
                                  src={invitation.group.avatar}
                                  alt={invitation.group.name}
                                  className="h-12 w-12 rounded-full"
                                />
                              ) : (
                                <span className="text-xl font-semibold">
                                  {invitation.group.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-medium">
                                {invitation.group.name}
                              </h3>
                              <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                                <span className="flex items-center">
                                  <Users className="mr-1 h-4 w-4" />
                                  {invitation.group.members} members
                                </span>
                                <span className="flex items-center">
                                  <MessageSquare className="mr-1 h-4 w-4" />
                                  {invitation.group.discussions} discussions
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-6 flex space-x-2">
                            <Button
                              variant="destructive"
                              onClick={() => handleDecline(invitation.id)}
                            >
                              Decline
                            </Button>
                            <Button onClick={() => handleAccept(invitation.id)}>
                              Accept
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
