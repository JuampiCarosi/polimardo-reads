import { cn } from "@/lib/utils";
import { useState, useMemo, useRef } from "react";
import { data } from "tailwindcss/defaultTheme";
import { Button } from "./ui/button";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useRouter } from "next/router";

export function ComitenteCombobox({
  className,
  modal = false,
  open,
  setOpen,
  placeholder,
}: {
  className?: string;
  comitenteId: number | undefined;
  onComitenteChange: (v: number | undefined) => void;
  modal?: boolean;
  open?: boolean;
  setOpen?: (v: boolean) => void;
}) {
  const [_open, _setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const data = [
    {
      isbn: "0195153448",
      book_title: "Classical Mythology",
      book_author: "Mark P. O. Morford",
      publish_year: "2002",
      publisher: "Oxford University Press",
      image_url_1:
        "http://images.amazon.com/images/P/0195153448.01.THUMBZZZ.jpg",
      image_url_2:
        "http://images.amazon.com/images/P/0195153448.01.MZZZZZZZ.jpg",
      image_url_3:
        "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
      id: 1,
    },
    {
      isbn: "0002005018",
      book_title: "Clara Callan",
      book_author: "Richard Bruce Wright",
      publish_year: "2001",
      publisher: "HarperFlamingo Canada",
      image_url_1:
        "http://images.amazon.com/images/P/0002005018.01.THUMBZZZ.jpg",
      image_url_2:
        "http://images.amazon.com/images/P/0002005018.01.MZZZZZZZ.jpg",
      image_url_3:
        "http://images.amazon.com/images/P/0002005018.01.LZZZZZZZ.jpg",
      id: 2,
    },
    {
      isbn: "0060973129",
      book_title: "Decision in Normandy",
      book_author: "Carlo D'Este",
      publish_year: "1991",
      publisher: "HarperPerennial",
      image_url_1:
        "http://images.amazon.com/images/P/0060973129.01.THUMBZZZ.jpg",
      image_url_2:
        "http://images.amazon.com/images/P/0060973129.01.MZZZZZZZ.jpg",
      image_url_3:
        "http://images.amazon.com/images/P/0060973129.01.LZZZZZZZ.jpg",
      id: 3,
    },
    {
      isbn: "0771074670",
      book_title: "Nights Below Station Street",
      book_author: "David Adams Richards",
      publish_year: "1988",
      publisher: "Emblem Editions",
      image_url_1:
        "http://images.amazon.com/images/P/0771074670.01.THUMBZZZ.jpg",
      image_url_2:
        "http://images.amazon.com/images/P/0771074670.01.MZZZZZZZ.jpg",
      image_url_3:
        "http://images.amazon.com/images/P/0771074670.01.LZZZZZZZ.jpg",
      id: 11,
    },
  ];

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 28,
    overscan: 15,
  });

  const router = useRouter();

  return (
    <Popover
      modal={modal}
      open={open ?? _open}
      onOpenChange={setOpen ?? _setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full max-w-[7.5rem] justify-between", className)}
        >
          <Search className="h-4 w-4" />
          Buscar
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Buscar Comitente..."
            className="h-9"
          />
          {/* {  <CommandEmpty>Cargando...</CommandEmpty>} */}

          <CommandEmpty>No hay comitente.</CommandEmpty>
          <CommandList className="p-0" ref={parentRef}>
            <CommandGroup>
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  const book = data[virtualRow.index]!;

                  return (
                    <CommandItem
                      key={book.id}
                      value={book.id.toString()}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      onSelect={async (currentValue) => {
                        await router.push(`/libros/${currentValue}`);
                        const openFn = setOpen ?? _setOpen;
                        openFn(false);
                      }}
                    >
                      <Image src={book.image_url_1} />
                      <div className="max-w-sm truncate text-ellipsis text-xs font-normal">
                        {comitente.comitenteId} - {comitente.comitente}
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          comitenteId === comitente.comitenteId
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
