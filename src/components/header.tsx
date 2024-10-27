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

  return (
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
      <div>
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

            <DropdownMenuCheckboxItem onClick={() => signOut()}>
              Cerrar sesión
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
