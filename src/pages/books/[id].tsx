import { useRouter } from "next/router";
import { type Book } from "../api/books/[id]";
import { useQuery } from "react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    const router = useRouter()
    const id = router.query.id;
    const { data: book} = useQuery<Book>({
        queryKey: [`books/${id as string}`], enabled: typeof id === 'string'
      });

      return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <Link href="/books" passHref>
          <Button variant="ghost" className="mb-4">
            Back to Books
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-64 h-96 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
              <img
                src={book?.image_url_3 ?? book?.image_url_2 ?? book?.image_url_1}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <h1 className="text-4xl font-bold text-primary">{book?.book_title}</h1>
            <p className="text-xl text-muted-foreground">by {book?.book_author}</p>
            <div className="border-t border-border pt-4">
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
      );}