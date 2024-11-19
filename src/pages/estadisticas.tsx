import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/header";
import { useQuery } from "react-query";
import type { Book } from "./api/books/[id]";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Stats() {
  const { data } = useQuery<Book[]>({
    queryKey: ["books", "library"],
  });

  const bookGenresData: Array<{ genre: string; value: number }> = [];

  data?.forEach((book) => {
    const genresString = (
      Array.isArray(book.genres) ? book.genres.join(", ") : book.genres
    ).replace(/[\[\]']+/g, "");

    if (genresString) {
      const genresArray = genresString.split(", ");
      genresArray.forEach((genre) => {
        const genreIndex = bookGenresData.findIndex(
          (genreData) => genreData.genre === genre,
        );
        if (genreIndex === -1) {
          bookGenresData.push({ genre, value: 1 });
        } else {
          if (bookGenresData[genreIndex]) bookGenresData[genreIndex].value += 1;
        }
      });
    }
  });

  const { data: monthlyData } = useQuery<
    Array<{ month: string; books: number }>
  >({
    queryKey: ["statistics"],
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">
          Estadisticas de Lectura
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Lectura Mensual</CardTitle>
              <CardDescription>
                Cantidad de libros leidos por semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="books" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorias de libros</CardTitle>
              <CardDescription>
                Porcentaje de libros leidos por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookGenresData}
                      dataKey="value"
                      nameKey="genre"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      label
                    >
                      {bookGenresData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.genre}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
