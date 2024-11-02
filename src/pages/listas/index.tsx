import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";
import { type Genres } from "../api/books/genres";

export default function Listas() {
  const [search, setSearch] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const { data: genres } = useQuery<Genres[]>({
    queryKey: ["books", "genres"],
  });

  const featuredBooks = [
    {
      id: 1,
      title: "Murder at the Vicarage",
      author: "Agatha Christie",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Chocolate Chip Cookie Murder",
      author: "Joanne Fluke",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "The Mysterious Affair at Styles",
      author: "Agatha Christie",
      image: "/placeholder.svg",
    },
    {
      id: 4,
      title: "The Sweetness at the Bottom of the Pie",
      author: "Alan Bradley",
      image: "/placeholder.svg",
    },
  ];

  // const { data, isLoading } = useQuery<BookRaw[]>({
  //   queryKey: ["books", "search", `?book=${search}`],
  // });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="min-h-screen bg-slate-50">
        <main className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-3xl font-bold text-slate-800">Listopia</h1>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              className="max-w-xl border-slate-200 bg-white pl-9 focus:border-slate-400 focus:ring-slate-400"
              placeholder="Search tags"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {genres?.slice(0, 12)?.map((genre) => (
              <Badge
                key={genre.id}
                variant="secondary"
                className="cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                {genre.name}
              </Badge>
            ))}
          </div>

          <nav className="mt-8 flex items-center gap-6">
            <Link
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Create new list
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Lists I&apos;ve created
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Lists I&apos;ve voted on
            </Link>
          </nav>

          <section className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-800">
                Featured lists
              </h2>
              <Button
                variant="ghost"
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <Card className="border-slate-200 bg-white">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <h3 className="mb-2 text-xl font-semibold text-slate-800">
                  Best Cozy Mystery Series
                </h3>
                <p className="mb-6 text-sm text-slate-500">
                  2,292 books · 2,662 voters
                </p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                  {featuredBooks.map((book) => (
                    <div key={book.id} className="space-y-3">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                        <Image
                          src={book.image}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium leading-none text-slate-800">
                          {book.title}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {book.author}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
