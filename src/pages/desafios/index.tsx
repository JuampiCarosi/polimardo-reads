import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useQuery } from "react-query";
import { type Genres } from "../api/books/genres";
import { GenresSelector } from "@/components/genres-selector";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/router";
import { Label } from "@/components/ui/label";
import { type ListDetailed } from "../api/lists/[id]";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MyChallenges } from "../api/challenges/[id]";



export default function Desafios() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const {data: myChallenges} = useQuery<MyChallenges[]>({
    queryKey: ["challenges", userId],
  })


  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="min-h-screen bg-slate-50">
        <main className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-3xl font-bold text-slate-800">Desafíos</h1>
          <div className="flex items-center justify-between">

            </div>
            <div>
                <Button size= "sm" asChild>
                    <Link href="/desafios/crear">Crear nuevo desafío</Link>
                </Button>
            </div>
          <Card className="border-slate-200 bg-white">
            <CardContent className="sm:p-8 lg:p-10">
              <div className="mb-6 flex items-center justify-between px-6">
                <h2 className="text-2xl font-semibold text-slate-800">
                  Mis Desafíos
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:gap-8">
                {myChallenges?.map((challenge) => (
                  <Card key={challenge.id} className="border-slate-200 bg-white">
                    <CardContent className="sm:p-8 lg:p-10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800">
                          {challenge.name}
                        </h3>
                        <Badge>{challenge.book_count} libros</Badge>
                      </div>
                      <div className="mt-4">
                        <p className="text-slate-600">{challenge.description}</p>
                      </div>
                      <div className="mt-6">
                    
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );

}

