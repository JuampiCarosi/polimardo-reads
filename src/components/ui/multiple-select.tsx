"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type Option = {
  label: string;
  value: string;
};

type DropdownMenuCheckboxesProps = {
  options: Option[] | undefined;
  selected: string[];
  setSelected: (options: string[]) => void;
  placeholder?: string;
  title?: string;
  className?: string;
};

export function DropdownMenuCheckboxes({
  selected: selectedOptions,
  setSelected: setSelectedOptions,
  options,
  placeholder,
  title,
  className,
}: DropdownMenuCheckboxesProps) {
  const changeOption = (option: Option) => {
    const isSelected = selectedOptions.includes(option.value);
    setSelectedOptions(
      isSelected
        ? selectedOptions.filter(
            (selectedOption) => selectedOption !== option.value,
          )
        : [...selectedOptions, option.value],
    );
  };

  const selectedOptionsString = selectedOptions
    .map((option) => options?.find((o) => o.value === option)?.label ?? "")
    .join(", ");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "h-9 justify-start",
            selectedOptions.length === 0 && "font-normal text-slate-400",
            className,
          )}
          variant="outline"
        >
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {selectedOptions.length === 0 ? placeholder : selectedOptionsString}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {title && (
          <>
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {options?.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedOptions.includes(option.value)}
            onCheckedChange={() => changeOption(option)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
