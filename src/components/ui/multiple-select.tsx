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
    [options, values],
  );

  function toggleValue(value: string) {
    setValuesToUse((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between text-slate-700", className)}
        >
          <span className="max-w-[150px] overflow-hidden text-ellipsis">
            {valuesToUse.length > 0
              ? selectedOptions.join(", ")
              : (placeholder ?? "Seleccione una")}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
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
