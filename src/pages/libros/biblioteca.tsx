import { useQuery } from "react-query";
import { type BookWithStatus } from "../api/books/[id]";
import { Header } from "@/components/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import Image from "next/image";
import { Pill } from "@/components/pill";
import { statusColors, statusLabels } from "./[id]";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";

export default function Page() {
  const { data } = useQuery<BookWithStatus[]>({
    queryKey: ["books", "library"],
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <Card className="mx-auto mt-4 w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Mi Biblioteca</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item) => (
                <TableRow key={item.isbn}>
                  <TableCell>
                    {item.cover_img && (
                      <Image
                        src={item.cover_img}
                        alt={item.title}
                        width={40}
                        height={40}
                      />
                    )}
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    <Pill
                      className="px-2 py-1"
                      color={statusColors[item.status!]}
                    >
                      {statusLabels[item.status!]}
                    </Pill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
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
  return {
    props: {},
  }
};