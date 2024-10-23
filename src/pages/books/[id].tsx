import { useRouter } from "next/router";
import { type Book } from "../api/books/[id]";
import { useQuery } from "react-query";

export default function Home() {
    const router = useRouter()
    const id = router.query.id;
    const { data: book} = useQuery<Book>({
        queryKey: [`books/${id as string}`], enabled: typeof id === 'string'
      });

  return (
    <div>
      <div className="">
        <h1>{book?.book_title}</h1>
      </div>
      <p>{book?.book_author}</p>
      <img src={book?.image_url_1} alt={book?.book_title} />
    </div>
  );
}