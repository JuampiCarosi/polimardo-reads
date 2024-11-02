import { type Genres } from "@/pages/api/books/genres";
import { useQuery } from "react-query";
import { MultipleSelect } from "./ui/multiple-select";

export function GenresSelector({
  genres,
  setGenres,
}: {
  genres: Array<string>;
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { data } = useQuery<Genres[]>({
    queryKey: ["books", "genres"],
  });

  const genresOptions =
    data?.map((genre) => ({
      value: genre.id,
      label: genre.name,
    })) ?? [];

  return (
    <MultipleSelect
      values={genres}
      setValues={setGenres}
      options={genresOptions}
    />
  );
}
