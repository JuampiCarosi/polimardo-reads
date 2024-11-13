import { useQuery } from "react-query";
import { type Friendship } from "@/pages/api/myFriends";
import { useSession } from "next-auth/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronsUpDown, Check } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

export function FriendsSelector({
  friends,
  setFriends,
  className,
  exclude,
}: {
  friends: Array<string>;
  setFriends: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
  exclude?: string[];
}) {
  const { data } = useQuery<Friendship[]>({
    queryKey: ["myFriends"],
  });
  const session = useSession();

  const friendsOptions =
    data
      ?.map((friend) => {
        if (friend.user_id === session.data?.user.id) {
          return {
            label: friend.friend_name,
            value: friend.friend_id,
          };
        }
        return {
          label: friend.user_name,
          value: friend.user_id,
        };
      })
      ?.filter((f) => !exclude?.includes(f.value)) ?? [];

  return (
    <MultipleSelect
      values={friends}
      setValues={setFriends}
      options={friendsOptions}
      className={className}
      placeholder="Seleccione amigos"
    />
  );
}

type Options = {
  label: string;
  value: string;
};

export function MultipleSelect({
  options,
  placeholder,
  className,
  values,
  setValues,
}: {
  options: Options[];
  placeholder?: string;
  className?: string;
  values?: string[];
  setValues?: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [_values, _setValues] = React.useState<string[]>([]);

  const valuesToUse = values ?? _values;
  const setValuesToUse = setValues ?? _setValues;

  const selectedOptions = React.useMemo(
    () =>
      valuesToUse.map((value) => options.find((o) => o.value === value)?.label),
    [options, valuesToUse],
  );

  function toggleValue(value: string) {
    setValuesToUse((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between text-slate-700", className)}
        >
          <span className={cn("max-w-[370px] overflow-hidden text-ellipsis")}>
            {valuesToUse.length > 0
              ? selectedOptions.join(", ")
              : (placeholder ?? "Seleccione una")}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[300px] p-0")}>
        <SelectCommand
          options={options}
          values={valuesToUse}
          toggleValue={toggleValue}
        />
      </PopoverContent>
    </Popover>
  );
}

function SelectCommand({
  options,
  values,
  toggleValue,
}: {
  options: Options[];
  values: string[];
  toggleValue: (value: string) => void;
}) {
  const [search, setSearch] = React.useState("");

  const parentRef = React.useRef(null);

  const filtered = React.useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      ),
    [options, search],
  );

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 42,
    overscan: 15,
  });

  return (
    <Command shouldFilter={false}>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Buscar..."
      />
      <CommandEmpty>No framework found.</CommandEmpty>
      <CommandList ref={parentRef}>
        <CommandGroup>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const o = filtered[virtualRow.index];
              if (!o) return null;
              return (
                <CommandItem
                  key={virtualRow.key}
                  value={o.value}
                  onSelect={(currentValue) => {
                    toggleValue(currentValue);
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      values.includes(o.value) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {o.label}
                </CommandItem>
              );
            })}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
