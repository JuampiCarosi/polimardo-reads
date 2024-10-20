import { Button } from "@/components/ui/button";

import { env } from "@/env";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-2">
      <h3 className="rounded-t-md border-b border-slate-200 px-2 py-1 text-lg font-medium text-slate-900">
        {title}
      </h3>
      <p className="px-2 pb-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

export default function Component() {
  const query = useSearchParams();
  const callbackUrl = query?.get("callbackUrl") ?? env.NEXT_PUBLIC_URL;

  return (
    <div className="">
      <SplitLayout>
        <div className="flex h-full flex-grow flex-col justify-between pt-24">
          <div>
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-slate-950">
                Polimardo reads
              </h1>
              <div className="mx-auto grid max-w-[500px] grid-cols-2 gap-5 pt-10">
                <Card
                  title="Comunidades"
                  description="Forma parte de comunidades de lectura donde compartir y comentar sobre tus libros favoritos."
                />
                <Card
                  title="Recomendaciones"
                  description="Recibe recomendaciones personalizadas basadas en tus gustos y preferencias."
                />

                <Card
                  title="Biblioteca"
                  description="Guarda tus libros favoritos y lleva un registro de tus lecturas."
                />

                <Card
                  title="Autores"
                  description="Ponte en contacto con tus autores favoritos y descubre nuevas obras."
                />
              </div>
            </div>

            <div className="mx-auto max-w-fit px-16 py-8">
              <div className="mt-4 flex justify-center">
                <Button
                  type="submit"
                  className="group relative flex w-56 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-8 text-sm font-medium text-slate-950 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
                  onClick={() => signIn("google", { callbackUrl })}
                >
                  <Image
                    alt="Google logo"
                    width={20}
                    height={20}
                    src="https://cdn.pixabay.com/photo/2021/05/24/09/15/google-logo-6278331_640.png"
                  />
                  Iniciar con Google
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center align-bottom text-sm text-slate-900">
            <p>
              Polimardo Reads 2024 - Todos los derechos reservados. Política de
              privacidad | Términos y condiciones
            </p>
          </div>
        </div>
      </SplitLayout>
    </div>
  );
}

export function SplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] justify-end overflow-y-auto lg:flex lg:flex-row-reverse">
      <div className="short:h-24 relative h-32 lg:h-auto lg:flex-grow">
        <Image
          className="h-full w-full object-cover"
          fill
          alt="Imagen de fondo con la bolsa celebrando el 100º aniversario de Aldazabal & cia."
          src="/books-3.jpg"
        />
        <div className="absolute inset-0 bg-stone-800/60" />
      </div>

      <div className="z-10 w-full p-4 px-10 max-lg:flex-grow md:p-6 md:px-12 lg:w-[60%] lg:min-w-[48rem] lg:shadow-2xl lg:shadow-slate-800 xl:w-1/2">
        {children}
      </div>
    </div>
  );
}
