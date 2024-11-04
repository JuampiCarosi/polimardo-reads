import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useQuery } from "react-query";
import { User } from "./api/users";

export default function Component() {
  const users = useQuery<User[]>("users", async () => {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
  console.log(users);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts =
    users.data?.filter((user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const handleAddFriend = (userId: string) => {
    console.log(userId);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="position-relative mx-auto mt-14 items-center">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
              <Input
                placeholder="Search Contacts"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              {filteredContacts.map((user) => (
                <div
                  key={user.id}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-lg p-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image ?? undefined} />
                      <AvatarFallback>
                        {(user.name ?? "NA").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleAddFriend(user.id)}>
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
