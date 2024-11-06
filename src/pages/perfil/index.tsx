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
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { country_list } from "@/pages/welcome";
import { type Session } from "next-auth";
import axios from "axios";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";

function Form({ user }: { user: Session["user"] }) {
  const [name, setName] = useState(user.name!);
  const [email, setEmail] = useState(user.email!);
  const [gender, setGender] = useState(user.gender);
  const [country, setCountry] = useState(user.country);
  const [birthdate, setBirthdate] = useState(user.birth_date);

  const handleSubmit = async () => {
    const user = {
      name,
      email,
      gender,
      country,
      birth_date: birthdate,
    };
    try {
      await axios.put("/api/users", { user });
      toast.success("Usuario actualizado correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el usuario");
    }
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
        <Button onClick={handleSubmit} className="w-full">
          Guardar Cambios
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function UserProfileEdit() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="min-h-screen bg-slate-100">
        <Header />

        <div className="position-relative mx-auto mt-14 items-center">
          {session && <Form user={session.user} />}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
