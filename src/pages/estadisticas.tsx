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

const monthlyReadingData = [
  { month: "Jan", books: 3 },
  { month: "Feb", books: 4 },
  { month: "Mar", books: 2 },
  { month: "Apr", books: 5 },
  { month: "May", books: 3 },
  { month: "Jun", books: 6 },
  { month: "Jul", books: 4 },
  { month: "Aug", books: 3 },
  { month: "Sep", books: 5 },
  { month: "Oct", books: 4 },
  { month: "Nov", books: 3 },
  { month: "Dec", books: 2 },
];

const bookCategoriesData = [
  { category: "Fiction", value: 40 },
  { category: "Non-Fiction", value: 30 },
  { category: "Science", value: 15 },
  { category: "Biography", value: 10 },
  { category: "Others", value: 5 },
];

const comparisonData = [
  { name: "You", books: 44 },
  { name: "Friends' Average", books: 36 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Component() {
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
                  <BarChart data={monthlyReadingData}>
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
                      data={bookCategoriesData}
                      dataKey="value"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      label
                    >
                      {bookCategoriesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
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

          <Card>
            <CardHeader>
              <CardTitle>Comparacion de Lectura</CardTitle>
              <CardDescription>
                Tu cantidad de libros leidos VS la media de tus amigos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="books">
                      {comparisonData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
