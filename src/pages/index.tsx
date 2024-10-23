import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const session = useSession();

  return (
    <>
      <Head>
        <title>Polimardo Reads</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
                <DropdownMenuCheckboxItem
                  onClick={() => router.push("/perfil")}
                >
                  Editar perfil
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem onClick={() => signOut()}>
                  Cerrar sesión
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Link
          href={"/busqueda"}
          className="flex w-full select-none items-center justify-center gap-1 pt-4 text-sm font-medium text-blue-700/90"
        >
          <Search className="size-3" /> Buscar libros...
        </Link>
      </div>
    </>
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

  if (!session.user.onboarding_completed) {
    return {
      redirect: {
        destination: "/welcome",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
