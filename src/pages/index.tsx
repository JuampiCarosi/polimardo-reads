import Head from "next/head";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Polimardo Reads</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-slate-100">
        <Header />
        <Link
          href={"/busqueda"}
          className="flex w-full select-none items-center justify-center gap-1 pt-4 text-sm font-medium text-blue-700/90"
        ></Link>
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
