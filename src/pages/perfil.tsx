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
import { type Session } from "next-auth";
import Link from "next/link";

function Form({ user }: { user: Session["user"] }) {
  const [name, setName] = useState(user.name!);
  const [email, setEmail] = useState(user.email!);
  const [gender, setGender] = useState(user.gender);
  const [country, setCountry] = useState(user.country);
  const [birthdate, setBirthdate] = useState(user.birth_date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, gender, country, birthdate });
  };

  return (
    <Card className="mx-auto max-w-2xl pb-10 pl-10 pr-10 pt-10">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image ?? undefined} alt={name} />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">Edita tu perfil</CardTitle>
            <CardDescription>Actualiza tu información personal</CardDescription>
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
              <Select value={gender ?? undefined} onValueChange={setGender}>
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
              <Select value={country ?? undefined} onValueChange={setCountry}>
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
              value={birthdate ?? undefined}
              onChange={(e) => setBirthdate(e.target.value)}
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
  );
}

export default function UserProfileEdit() {
  const { data: session } = useSession();

  const router = useRouter();

  return (
    <div>
      <div className="min-h-screen bg-slate-100">
        <div className="flex h-[70px] items-center justify-between bg-slate-800 px-4 py-4 text-slate-200 shadow shadow-slate-200">
          <div className="flex items-center gap-7">
            <Link href="/" className="text-xl font-semibold">
              Polimardo Reads
            </Link>
            <div className="space-x-3 font-medium">
              <Link className="hover:underline" href="/">
                Home
              </Link>
              <Link className="hover:underline" href="/busqueda">
                Buscar
              </Link>
            </div>
          </div>
          <Undo2 className="cursor-pointer" onClick={() => router.back()} />
        </div>
        <div className="position-relative mx-auto mt-14 items-center">
          {session && <Form user={session.user} />}
        </div>
      </div>
    </div>
  );
}
