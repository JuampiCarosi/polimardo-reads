import Head from "next/head";
import { useQuery } from "react-query";
import { type Database } from "@/types/supabase";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";

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
        <div className="flex items-center justify-between bg-slate-800 px-4 py-4 text-slate-200 shadow shadow-slate-200">
          <h1 className="text-xl font-semibold">Polimardo Reads</h1>
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
