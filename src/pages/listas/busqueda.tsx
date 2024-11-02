import Image from "next/image";
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
import { List } from "../api/lists";

export default function Busqueda() {
  const router = useRouter();
  const search = router.query?.search;

  console.log(search);

  const { data } = useQuery<List[]>({
    queryKey: [`lists?search=${search}`],
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

        <div className="grid gap-6 md:grid-cols-2">
          {data?.map((list, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle>
                  <Link
                    href="#"
                    className="text-primary text-lg font-semibold hover:underline"
                  >
                    {list.name}
                  </Link>
                </CardTitle>
                <CardDescription>{list.description}</CardDescription>
                <p className="text-muted-foreground text-sm">
                  {/* {list.books.toLocaleString()} books —{" "}
                  {list.voters.toLocaleString()} voters */}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {/* {list.covers.map((cover, coverIndex) => (
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
                  ))} */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
