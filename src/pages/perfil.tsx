import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Undo2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { country_list } from "@/pages/welcome";
import { useRouter } from "next/router";

export default function UserProfileEdit() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [birthdate, setBirthdate] = useState<Date>();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, gender, country, birthdate });
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-100">
        <div className="flex h-[70px] items-center justify-between bg-slate-800 px-4 py-4 text-slate-200 shadow shadow-slate-200">
          <h1 className="text-xl font-semibold">Polimardo Reads</h1>
          <Undo2 className="cursor-pointer" onClick={() => router.back()} />
        </div>
        <div className="position-relative mx-auto mt-14 items-center">
          <Card className="mx-auto max-w-2xl pb-10 pl-10 pr-10 pt-10">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session?.user?.image ?? ""} alt={name} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">Edita tu perfil</CardTitle>
                  <CardDescription>
                    Actualiza tu información personal
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Usuario</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Genero</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Seleccionar genero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Pais</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Seleccionar pais" />
                      </SelectTrigger>
                      <SelectContent>
                        {country_list.map((country: string) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthdate">Fecha de nacimiento</Label>
                  <Input
                    id="birthdate"
                    value={birthdate?.toISOString().split("T")[0]}
                    onChange={(e) => setBirthdate(new Date(e.target.value))}
                    type="date"
                    className={cn("pl-10", "text-slate-600")}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Guardar Cambios
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
