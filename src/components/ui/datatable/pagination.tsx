import { useDataTable } from "@/components/ui/datatable/hooks";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTableContext } from "@/components/ui/datatable/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DataTablePagination({
  allwaysShow = false,
  customSizes,
}: {
  allwaysShow?: boolean;
  customSizes?: number[];
}) {
  const { table, paginationDefault } = useDataTable();
  const { rounded } = useTableContext();

  const sizesSet = new Set([
    10,
    20,
    30,
    40,
    50,
    10000,
    paginationDefault ?? 10,
    ...(customSizes ?? []),
  ]);
  const sizes = Array.from(sizesSet).sort((a, b) => a - b);

  if (
    table.getPageCount() < 2 &&
    table.getRowModel().flatRows.length < 10 &&
    !allwaysShow
  )
    return null;
  return (
    <div
      className={cn(
        "mt-auto flex items-center justify-between pt-2 text-slate-500",
        {
          "pb-2": rounded !== "all",
          "border-t border-slate-200 px-3": rounded === "none",
        },
      )}
    >
      <div className="flex-1 text-sm">
        {table.getFilteredSelectedRowModel().flatRows.length > 0 && (
          <>
            {table.getFilteredSelectedRowModel().flatRows.length} fila(s)
            seleccionadas.
          </>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-xs sm:block">Filas por página</p>
          <p className="text-xs sm:hidden">Filas</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-7 w-[70px] bg-white">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {sizes.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize === 10000 ? "Máx" : pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[90px] items-center justify-center text-xs">
          Pág. {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-7 w-7 bg-white p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir a primer página</span>
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            className="h-7 w-7 bg-white p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir a página anterior</span>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            className="h-7 w-7 bg-white p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir a página siguiente</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-7 w-7 bg-white p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir a última página</span>
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
