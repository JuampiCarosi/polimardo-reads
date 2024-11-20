import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import { getServerSidePropsWithAuth } from "@/lib/with-auth";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { type Forum } from "../../api/forums";
import { Pill } from "@/components/pill";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Forum() {
    const { data } = useQuery<Forum[]>({
        queryKey: ["forums"],
    });
    console.log(data);


    return (
        <div className="min-h-screen bg-slate-100">
            <Header />
            <Card className="mx-auto mt-4 w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Mis foros</CardTitle>
                    <div className="flex justify-end">
                    <CreateForumDialog />
                    </div>

                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre del foro</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Discusiones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((item) => (
                                <TableRow
                                    onClick={() => router.push(`/foros/${item.id}`)}
                                    key={item.id}
                                    className="cursor-pointer"
                                >
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>
                                        <Pill
                                            className="px-2 py-1"
                                            color={item.status === true ? "green" : "red"}
                                        >
                                            {item.status === true ? "Abierto" : "Cerrado"}
                                        </Pill>
                                    </TableCell>
                                    <TableCell>{item.discussions_count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {data?.length === 0 && (
                        <p className="mt-4 text-center text-gray-500">No hay resultados</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}



function CreateForumDialog() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");

    const queryClient = useQueryClient();
    async function handleCreateForum() {
        if (title.length < 3) {
            toast.error("El título debe tener al menos 3 caracteres");
            return;
        }
        setOpen(false);

        const res = await fetch("/api/forums", {
            method: "POST",
            body: JSON.stringify({ title }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.ok) {
            toast.success("Foro creado exitosamente");
        } else {
            toast.error("Error creando foro");
        }
        void queryClient.invalidateQueries(["forums"]);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Crear foro</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Crear foro</DialogTitle>
                <div className="space-y-1">
                    <Label className="text-base" htmlFor="title">
                        Título
                    </Label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título del foro"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline">Cancelar</Button>
                    <Button onClick={handleCreateForum}>Crear foro</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export const getServerSideProps = getServerSidePropsWithAuth();
