import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Bell, X } from "lucide-react";
import { useQuery } from "react-query";
import { type Notification } from "@/pages/api/notifications";
import { toast } from "sonner";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;
  const [open, setOpen] = useState(false);

  const { data: notifiactions, refetch } = useQuery<Notification[]>({
    queryKey: ["notifications"],
  });

  async function handleDeleteNotification(id: string) {
    const res = await fetch(`/api/notifications/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Error al eliminar la notificación");
    } else {
      await refetch();
    }
  }

  return (
    <div className="flex h-[70px] items-center justify-between bg-slate-800 px-4 py-4 text-slate-200 shadow shadow-slate-200">
      <div className="flex items-center gap-7">
        <Link href="/" className="text-xl font-semibold">
          Polimardo Reads
        </Link>
      </div>
      <div className="flex items-center gap-10">
        <div className="flex items-center space-x-8 font-medium">
          <Link className="hover:scale-105" href="/">
            Home
          </Link>
          <Link className="hover:scale-105" href="/libros/biblioteca">
            Mis libros
          </Link>
          <Link className="hover:scale-105" href="/listas">
            Listas
          </Link>
          <Link className="hover:scale-105" href="/descubrir-amigos">
            Descubrir Amigos
          </Link>
          <Link className="hover:scale-105" href="/desafios">
            Desafíos
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="cursor-pointer hover:scale-105"
              asChild
            >
              <p>Buscar</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                onClick={() => router.push("/busqueda")}
              >
                Libros
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                onClick={() => router.push(`/foros/busqueda`)}
              >
                Foros
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                onClick={() => router.push(`/desafios/busqueda`)}
              >
                Desafios
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link className="hover:scale-105" href="/estadisticas">
            Mis Estadisticas
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="relative">
              {(notifiactions?.length ?? 0) > 0 && (
                <div className="absolute -right-1 top-0.5 h-1.5 w-1.5 rounded-full bg-red-400/90" />
              )}
              <Bell className="size-5" />
            </PopoverTrigger>
            <PopoverContent>
              <h3 className="pb-2 text-base font-semibold text-slate-800">
                Notificaciones
              </h3>
              {notifiactions?.length === 0 && (
                <p className="pt-1 text-center text-xs text-slate-500">
                  No hay notificaciones
                </p>
              )}
              {notifiactions?.map((notification) => (
                <div
                  className="flex items-center gap-2 border-b px-3 py-2 text-xs text-slate-700 last:border-b-0"
                  key={notification.id}
                >
                  <div className="flex items-center gap-2">
                    <span className="max-w-44">{notification.title}</span>
                    {notification.url && (
                      <Link
                        className="text-blue-700 hover:text-blue-800 hover:underline"
                        href={notification.url}
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                      >
                        ver
                      </Link>
                    )}
                  </div>
                  <X
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="size-5 cursor-pointer rounded-md p-1 hover:bg-slate-100"
                  />
                </div>
              ))}
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
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
              {user?.role === "author" && (
                <DropdownMenuCheckboxItem
                  onClick={() => router.push(`/perfil/${user?.id}/foros`)}
                >
                  Mis foros
                </DropdownMenuCheckboxItem>
              )}
              <DropdownMenuCheckboxItem onClick={() => signOut()}>
                Cerrar sesión
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
