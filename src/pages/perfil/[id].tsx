import { Header } from "@/components/header";
import { type User } from "../api/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Flag,
  Mail,
  MapPin,
  UserCircle,
  User as UserComponent,
} from "lucide-react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { type Genres } from "../api/user-preferred-genres";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["users", `?id=${id as string}`],
    enabled: typeof id === "string",
  });

  const {
    data: genres,
    isLoading: isLoadingGenres,
    error: errorGenres,
  } = useQuery<Genres[]>({
    queryKey: ["user-preferred-genres", `?id=${id as string}`],
    enabled: typeof id === "string",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error || !user) return <div>Error loading user data.</div>;

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="position-relative mx-auto mt-14 items-center">
        <Card className="mx-auto max-w-2xl pb-10 pl-10 pr-10 pt-10">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user?.image ?? undefined}
                  alt={user?.name ?? ""}
                />
                <AvatarFallback>
                  <UserComponent className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.name}</CardTitle>
                <CardDescription>{user?.role}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="text-muted-foreground h-5 w-5" />
                <span>{user?.email ?? "No email provided"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="text-muted-foreground h-5 w-5" />
                <span>{user?.birth_date ?? "No birth date provided"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="text-muted-foreground h-5 w-5" />
                <span>{user?.country ?? "No country provided"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Flag className="text-muted-foreground h-5 w-5" />
                <span>{user?.gender ?? "No gender provided"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCircle className="text-muted-foreground h-5 w-5" />
                <span>
                  {user?.onboarding_completed
                    ? "Onboarding completed"
                    : "Onboarding not completed"}
                </span>
              </div>
              <Separator className="mt-8"></Separator>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Géneros favoritos</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span>
                  {isLoadingGenres ? (
                    "Loading..."
                  ) : errorGenres ? (
                    "Error loading genres"
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {genres?.map((genre) => (
                        <div
                          key={genre.id}
                          className="rounded-full bg-gray-200 px-4 py-2"
                        >
                          {genre.name}
                        </div>
                      ))}
                    </div>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
