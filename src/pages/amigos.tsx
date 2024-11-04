import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";

interface Contact {
  id: string;
  name: string;
  mutualFriends: number;
  image: string;
  status: "none" | "pending" | "friends";
}

export default function Component() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddFriend = (contactId: string) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? { ...contact, status: "pending" } : contact,
      ),
    );
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
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-lg p-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={contact.image} alt={contact.name} />
                      <AvatarFallback>
                        {contact.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {contact.mutualFriends} mutual friend
                        {contact.mutualFriends !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  {contact.status === "none" ? (
                    <Button
                      size="sm"
                      onClick={() => handleAddFriend(contact.id)}
                    >
                      Add
                    </Button>
                  ) : contact.status === "pending" ? (
                    <Button size="sm" variant="secondary" disabled>
                      Pending...
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
