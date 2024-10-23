import { useRouter } from "next/router";
import { type Book } from "../api/books/[id]";
import { useQuery } from "react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const id = router.query.id;
  const { data: book } = useQuery<Book>({
    queryKey: [`books/${id as string}`],
    enabled: typeof id === "string",
  });

  return (
    <div className="from-background to-secondary min-h-screen bg-gradient-to-b">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" passHref>
          <Button variant="ghost" className="mb-4">
            Back to Search
          </Button>
        </Link>
        <div className="flex flex-col items-center space-y-8 md:flex-row md:items-start md:space-x-8 md:space-y-0">
          <div className="flex w-full justify-center md:w-1/3">
            <div className="relative h-96 w-64 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
              <img
                src={
                  book?.image_url_3 ?? book?.image_url_2 ?? book?.image_url_1
                }
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="w-full space-y-4 md:w-2/3">
            <h1 className="text-primary text-4xl font-bold">
              {book?.book_title}
            </h1>
            <p className="text-muted-foreground text-xl">
              by {book?.book_author}
            </p>
            <div className="border-border border-t pt-4">
              {/* <h2 className="text-2xl font-semibold mb-2">About this book</h2> */}
              {/* <p className="text-muted-foreground">
                This is where you would put a description of the book. Since we dont have actual data,
                this is just placeholder text. In a real application, you would fetch this information
                from your database or API.
              </p> */}
            </div>
            <Button className="mt-4">Add to Reading List</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
