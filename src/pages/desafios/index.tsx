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



export default function Desafios() {


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
        </main>
      </div>
    </div>
  );

}

