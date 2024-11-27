import { Header } from "@/components/header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { getServerSidePropsWithAuth } from "@/lib/with-auth";
import { type Discussion } from "@/pages/api/forums/[id]/discussions/[discussionId]";
import { type GroupInfo } from "@/pages/api/groups/[id]";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

export default function Discusion() {
  const [newComment, setNewComment] = React.useState("");
  const { discussionId, id } = useRouter().query;

  const { data, refetch } = useQuery<Discussion>({
    queryKey: ["groups", id as string, "discussions", discussionId as string],
    enabled: typeof discussionId === "string" && typeof id === "string",
  });

  const postCommentMutation = useMutation({
    onSuccess: async () => {
      await refetch();
      setNewComment("");
    },
    onError: (error) => {
      toast.error("Hubo un error al agregar el comentario");
      console.error(error);
    },
    mutationFn: async () => {
      if (
        !newComment ||
        newComment.length < 1 ||
        typeof discussionId !== "string" ||
        typeof id !== "string"
      ) {
        toast.error("El comentario no puede estar vacio");
        return;
      }
      const res = await fetch(
        `/api/groups/${id}/discussions/${discussionId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: newComment,
          }),
        },
      );
      if (res.ok) {
        toast.success("Comentario agregado correctamente");
      } else {
        throw new Error("Error adding comment");
      }
    },
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="mx-auto mt-3 max-w-6xl space-y-4">
        <BreadCrumbs discussion={data} />
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  {data?.title}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Iniciado por {data?.user_name} •{" "}
                  {data?.created_at && format(data.created_at, "dd/MM/yyyy")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-700">{data?.description}</p>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span className="flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" />
                {data?.comments.length} Respuestas
              </span>
            </div>
          </CardContent>
        </Card>

        <h3 className="mb-4 text-xl font-semibold text-slate-800">
          Respuestas
        </h3>

        <ScrollArea className="mb-8 max-h-[calc(100vh-24rem)] overflow-scroll">
          <div className="space-y-4 p-1">
            {data?.comments.map((comment) => (
              <div key={comment.id} className="rounded-lg bg-white p-4 shadow">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={comment.user_img}
                      alt={comment.user_name}
                    />
                    <AvatarFallback className="border border-slate-400">
                      {comment.user_name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-slate-900">
                        {comment.user_name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {format(comment.created_at, "dd-MM-yyyy")}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            postCommentMutation.mutate();
          }}
          className="mt-4"
        >
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-4 bg-white"
          />
          <Button disabled={postCommentMutation.isLoading} type="submit">
            Post Comment
          </Button>
        </form>
      </div>
    </div>
  );
}

function BreadCrumbs({ discussion }: { discussion: Discussion | undefined }) {
  const { query } = useRouter();

  const { data } = useQuery<GroupInfo>({
    queryKey: ["groups", query.id as string],
    enabled: typeof query.id === "string",
  });

  return (
    <Breadcrumb className="pl-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/grupos">Mis Grupos</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/grupos/${data?.id}`}>
            {data?.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{discussion?.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export const getServerSideProps = getServerSidePropsWithAuth();
