import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "./ui/dropdown-menu";
import Link from "next/link";

export function Header() {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="flex h-[70px] items-center justify-between bg-slate-800 px-4 py-4 text-slate-200 shadow shadow-slate-200">
      <div className="flex items-center gap-7">
        <Link href="/" className="text-xl font-semibold">
          Polimardo Reads
        </Link>
      </div>
      <div className="flex items-center gap-10">
        <div className="space-x-8 font-medium">
          <Link className="hover:underline" href="/">
            Home
          </Link>
          <Link className="hover:underline" href="/busqueda">
            Buscar
          </Link>
          <Link className="hover:underline" href="/libros/biblioteca">
            Mis libros
          </Link>
          <Link className="hover:underline" href="/listas">
            Listas
          </Link>
          <Link className="hover:underline" href="/descubrir-amigos">
            Descubrir Amigos
          </Link>
          <Link className="hover:underline" href="/desafios">
            Desafíos
          </Link>
          <Link className="hover:underline" href="/desafios/busqueda">
            Descubrir desafios
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage
                src={session.data?.user.image ?? undefined}
                alt={session.data?.user.name ?? undefined}
              />
              <AvatarFallback>{session.data?.user.name}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem onClick={() => router.push("/perfil")}>
              Editar perfil
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              onClick={() => router.push(`/perfil/${user?.id}`)}
            >
              Ver perfil
            </DropdownMenuCheckboxItem>

            {user?.role === "author" && (
              <DropdownMenuCheckboxItem
                onClick={() => router.push("/publicar-libro")}
              >
                Publicar libro
              </DropdownMenuCheckboxItem>
            )}
            <DropdownMenuCheckboxItem
              onClick={() => router.push("/mis-amigos")}
            >
              Mis amigos
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => router.push("/grupos")}>
              Grupos
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              onClick={() => router.push("/grupos/invitaciones")}
            >
              Invitaciones Grupos
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => signOut()}>
              Cerrar sesión
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
