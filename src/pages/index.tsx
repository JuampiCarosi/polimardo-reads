import Head from "next/head";
import { useQuery } from "react-query";
import { type Database } from "@/types/supabase";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";

export default function Home() {
  const [count, setCount] = useState(0);

  const { data } = useQuery<Database["public"]["Tables"]["test"]["Row"]>({
    queryKey: ["hello"],
  });

  const session = useSession();

  return (
    <>
      <Head>
        <title>Polimardo Reads</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Polimardo Reads
          </h1>
          <div className="text-white">
            <pre className="font-mono">
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>
          <div className="text-white">
            <pre className="font-mono">
              <code>{JSON.stringify(session, null, 2)}</code>
            </pre>
          </div>

          <button
            className="rounded-lg bg-blue-500 px-4 py-2 text-white"
            onClick={() => setCount((prev) => prev + 1)}
          >
            Increment count: {count}
          </button>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session?.user.onboarding_completed) {
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