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



export const getServerSideProps = getServerSidePropsWithAuth();
