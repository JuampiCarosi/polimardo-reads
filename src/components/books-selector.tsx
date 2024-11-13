"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "react-query";
import { type BookRaw } from "@/pages/api/books/[id]";
import { LoadingSpinner } from "./loading-spinner";

export function BookSelector({
  placeholder,
  className,
  value,
  setValue,
  valuesClassName,
  onSelect,
  children,
  dontSelect,
}: {
  placeholder?: string;
  className?: string;
  value?: string | undefined;
  setValue?: React.Dispatch<React.SetStateAction<string | undefined>>;
  valuesClassName?: string;
  onSelect?: (option: BookRaw) => Promise<void> | void;
  children?: React.ReactNode;
  dontSelect?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [_value, _setValue] = React.useState<string>();

  const valueToUse = value ?? _value;
  const setValueToUse = setValue ?? _setValue;
  const closeModal = () => setOpen(false);

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-[200px] justify-between text-slate-700",
              className,
            )}
          >
            <span
              className={cn(
                "max-w-[150px] overflow-hidden text-ellipsis",
                valuesClassName,
              )}
            >
              {value ? value : (placeholder ?? "Seleccione una")}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <SelectCommand
          value={valueToUse}
          setValue={setValueToUse}
          onSelect={onSelect}
          closeModal={closeModal}
          dontSelect={dontSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
export function MultipleBookSelector({
  placeholder,
  className,
  value,
  setValue,
  valuesClassName,
  children,
}: {
  placeholder?: string;
  className?: string;
  value?: string[];
  setValue?: React.Dispatch<React.SetStateAction<string[]>>;
  valuesClassName?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [_value, _setValue] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");

  const valueToUse = value ?? _value;
  const setValueToUse = setValue ?? _setValue;

  const { data, isLoading } = useQuery<BookRaw[]>({
    queryKey: ["books", "search", `?q=${search}&filter=all`],
  });

  const selectedOptions = React.useMemo(
    () => valueToUse.map((value) => data?.find((o) => o.id === value)?.title),
    [data, valueToUse],
  );

  function toggleValue(value: string) {
    setValueToUse((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between text-slate-700", className)}
          >
            <span
              className={cn("overflow-hidden text-ellipsis", valuesClassName)}
            >
              {valueToUse.length > 0
                ? selectedOptions.join(", ")
                : (placeholder ?? "Seleccione una")}{" "}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <MultipleSelectCommand
          data={data ?? []}
          isLoading={isLoading}
          search={search}
          setSearch={setSearch}
          values={valueToUse}
          toggleValue={toggleValue}
        />
      </PopoverContent>
    </Popover>
  );
}

function SelectCommand({
  value,
  setValue,
  onSelect,
  dontSelect,
  closeModal,
}: {
  value: string | undefined;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSelect?: (option: BookRaw) => Promise<void> | void;
  dontSelect?: boolean;
  closeModal: () => void;
}) {
  const [search, setSearch] = React.useState("");
  const parentRef = React.useRef(null);
  const { data, isLoading } = useQuery<BookRaw[]>({
    queryKey: ["books", "search", `?q=${search}&filter=all`],
  });

  const rowVirtualizer = useVirtualizer({
    count: data?.length ?? 100,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 46,
    overscan: 15,
  });

  return (
    <Command shouldFilter={false}>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Buscar..."
      />
      <CommandEmpty>No se encontro ningun libro.</CommandEmpty>
      <CommandList ref={parentRef}>
        <CommandGroup>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {isLoading && (
              <CommandItem>
                <div className="flex w-full items-center justify-center gap-2">
                  Buscando
                  <LoadingSpinner />
                </div>
              </CommandItem>
            )}
            {data &&
              !isLoading &&
              rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const o = data[virtualRow.index];
                if (!o) return null;
                return (
                  <CommandItem
                    key={virtualRow.key}
                    value={o.id}
                    onSelect={async (currentValue) => {
                      if (!dontSelect) {
                        setValue((prev) =>
                          prev === currentValue ? undefined : currentValue,
                        );
                      }
                      const opt = data.find((o) => o.id === currentValue)!;
                      await onSelect?.(opt);
                      closeModal();
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
                        value === o.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {o.title}
                  </CommandItem>
                );
              })}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function MultipleSelectCommand({
  values,
  toggleValue,
  data,
  search,
  setSearch,
}: {
  values: string[];
  toggleValue: (value: string) => void;
  data: BookRaw[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}) {
  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: data?.length ?? 99,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
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
              const o = data?.[virtualRow.index];
              if (!o) return null;
              return (
                <CommandItem
                  key={virtualRow.key}
                  value={o.id}
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
                      values.includes(o.id) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {o.title}
                </CommandItem>
              );
            })}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
