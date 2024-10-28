import { ArrowDown, ArrowLeftRight, ArrowUp, EyeOff } from "lucide-react";
import { type Column } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column?: Column<TData, TValue>;
  title: string;
  labelPlace?: "center" | "right" | "left";
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  labelPlace,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            style={{ textAlign: "inherit" }}
            className="-mx-2 -my-1 block h-8 w-[calc(100%+1rem)] px-2 focus-visible:ring-0 data-[state=open]:bg-slate-200 sm:h-7"
          >
            <span className="relative">
              {title}
              {column?.getCanSort() && (
                <span
                  className={cn(
                    "absolute",
                    labelPlace === "right" ? "right-full" : "left-full",
                  )}
                >
                  {column?.getIsSorted() === "desc" ? (
                    <ArrowDown className="mx-2 h-4 w-4" />
                  ) : column?.getIsSorted() === "asc" ? (
                    <ArrowUp className="mx-2 h-4 w-4" />
                  ) : null}
                </span>
              )}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={
            labelPlace === "left"
              ? "start"
              : labelPlace === "right"
                ? "end"
                : "center"
          }
        >
          {column?.getCanSort() && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUp className="mr-2 h-3 w-3 text-slate-600/70" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDown className="mr-2 h-3 w-3 text-slate-600/70" />
                Desc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <ArrowLeftRight className="mr-2 h-3 w-3 text-slate-600/70" />
                No ord.
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column?.toggleVisibility(false)}>
            <EyeOff className="mr-2 h-3 w-3 text-slate-600/70" />
            Ocultar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
