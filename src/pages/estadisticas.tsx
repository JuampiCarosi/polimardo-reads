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
import type { Friendship } from "./api/myFriends";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const fetchFriendData = async (friendId: string, friendName: string) => {
  return new Promise<{ name: string; books: number }>((resolve, reject) => {
    const name = friendName;
    const books = useQuery<Book[]>({
      queryKey: ["books", "library", friendId],
    });

    if (books.data) {
      resolve({ name, books: books.data?.length });
    } else {
      reject(new Error("Failed to fetch friend's data. Please try again."));
    }
  });
};

export default function Stats() {
  const session = useSession();

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

  bookGenresData.sort((a, b) => b.value - a.value);
  if (bookGenresData.length > 5) {
    bookGenresData.splice(5, bookGenresData.length - 5);
  }

  const { data: monthlyData } = useQuery<
    Array<{ month: string; books: number }>
  >({
    queryKey: ["statistics"],
  });

  const myFriends = useQuery<Friendship[]>({
    queryKey: ["myFriends"],
  });

  const friends = myFriends.data?.map((friendship) => ({
    friend_name:
      friendship.user_id === session.data?.user.id
        ? friendship.friend_name
        : friendship.user_name,

    friend_id:
      friendship.user_id === session.data?.user.id
        ? friendship.friend_id
        : friendship.user_id,
  }));

  const [selectedFriend, setSelectedFriend] = useState(
    friends ? friends[0] : null,
  );

  const [comparisonData, setComparisonData] = useState<
    Array<{ name: string; books: number }>
  >([{ name: "You", books: data?.length ?? 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFriend) {
      setIsLoading(true);
      setError(null);
      fetchFriendData(selectedFriend?.friend_id, selectedFriend?.friend_name)
        .then((friendData) => {
          setComparisonData([{ name: "You", books: 8 }, friendData]);
          setIsLoading(false);
        })
        .catch((_) => {
          setError("Failed to fetch friend's data. Please try again.");
          setIsLoading(false);
        });
    }
  }, [selectedFriend]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">
          Estadisticas de Lectura
        </h1>
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
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
              <CardTitle>Generos de libros</CardTitle>
              <CardDescription>
                Tu top 5 generos de libros leidos
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
          <Card>
            <CardHeader>
              <CardTitle>Comparacion de Lectura</CardTitle>
              <CardDescription>
                Tu cantidad de libros leidos VS un amigo en particular
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select
                  value={selectedFriend?.friend_name}
                  onValueChange={(value) => {
                    const friend = friends?.find(
                      (f) => f.friend_name === value,
                    );
                    setSelectedFriend(friend ?? null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona a un amigo" />
                  </SelectTrigger>
                  <SelectContent>
                    {friends?.map((friend) => (
                      <SelectItem
                        key={friend.friend_name}
                        value={friend.friend_name}
                      >
                        {friend.friend_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="h-[250px] w-full pt-8">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
