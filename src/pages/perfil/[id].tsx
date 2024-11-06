import { User } from "../api/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  Music,
  UserCircle,
  User as UserComponent,
} from "lucide-react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await fetch(`/api/users?id=${id as string}`);
      //   console.log("🚀 ~ queryFn: ~ response:", response);
      if (!response.ok) throw new Error("User not found");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.json();
    },
    enabled: !!id, // only run query if id is defined
  });

  if (isLoading) return <div>Loading...</div>;
  if (error || !user) return <div>Error loading user data.</div>;

  return (
    <Card className="mx-auto max-w-2xl pb-10 pl-10 pr-10 pt-10">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
            <AvatarFallback>
              <UserComponent className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Mail className="text-muted-foreground h-5 w-5" />
            <span>{user.email || "No email provided"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="text-muted-foreground h-5 w-5" />
            <span>{user.birth_date || "No birth date provided"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="text-muted-foreground h-5 w-5" />
            <span>{user.country || "No country provided"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Flag className="text-muted-foreground h-5 w-5" />
            <span>{user.gender || "No gender provided"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserCircle className="text-muted-foreground h-5 w-5" />
            <span>
              {user.onboarding_completed
                ? "Onboarding completed"
                : "Onboarding not completed"}
            </span>
          </div>
          {/* <div className="flex items-start space-x-2">
            <Music className="text-muted-foreground mt-1 h-5 w-5" />
            <div>
              <span className="font-semibold">Genres:</span>
              {user.genres && user.genres.length > 0 ? (
                <ul className="list-inside list-disc">
                  {user.genres.map((genre, index) => (
                    <li key={index}>{genre}</li>
                  ))}
                </ul>
              ) : (
                <span> No genres provided</span>
              )}
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
