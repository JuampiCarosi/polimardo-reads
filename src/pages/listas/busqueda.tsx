import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/header";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { type List } from "../api/lists";
import Image from "next/image";

export default function Busqueda() {
  const router = useRouter();
  const search = router.query?.search;

  const { data } = useQuery<List[]>({
    queryKey: [`lists?search=${search as string}`],
    enabled: typeof search === "string",
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="mb-6 text-3xl font-bold text-slate-800">
            Listardas &gt; {search}
          </h1>
        </header>

        {data?.length === 0 && (
          <span className="flex justify-center text-sm font-semibold text-slate-500">
            No se encontraron listas que coincidan con el criterio de busqueda
          </span>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {data?.map((list, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle>
                  <Link
                    href={`/listas/${list.id}`}
                    className="text-primary text-lg font-semibold hover:underline"
                  >
                    {list.name}
                  </Link>
                </CardTitle>
                <CardDescription className="flex flex-col">
                  <span className="text-muted-foreground text-sm font-normal text-slate-500">
                    {list.books_count} books — {list.voters_count} voters
                  </span>
                  <span>{list.description}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {list.covers.map((cover, coverIndex) => (
                    <Link
                      key={coverIndex}
                      href="#"
                      className="relative aspect-[2/3] overflow-hidden rounded-sm hover:opacity-80"
                    >
                      <Image
                        src={cover}
                        alt={`Book cover ${coverIndex + 1}`}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 20vw, 10vw"
                      />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
