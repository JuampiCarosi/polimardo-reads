import {
  DataTable,
  type ColumnProps,
  type RowsProps,
  type ActionProps,
  type DataTableRootProps,
  type ColumnPropsGeneric,
} from "@/components/ui/datatable/datatable";
import { formatNumber } from "@/lib/numbers";
import {
  type SortingState,
  type Updater,
  type VisibilityState,
  type PaginationState,
  type ExpandedState,
  type Row,
  sortingFns,
  type Table,
  useReactTable,
  getExpandedRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { type ValueOf } from "next/dist/shared/lib/constants";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
  createContext,
  type ReactNode,
  Children,
  useLayoutEffect,
  useRef,
} from "react";

export function getAccessor(column: ColumnPropsGeneric) {
  return "accessor" in column ? column.accessor : column.accessorAlias;
}

function useLocalStorage<T>(key: string | undefined, defaultValue: T) {
  const [changed, setChanged] = useState(false);
  const [value, setValue] = useState(() => {
    const savedValue =
      key && typeof window !== "undefined"
        ? (window.localStorage.getItem(key) ?? "null")
        : "null";
    return (JSON.parse(savedValue) as T) ?? defaultValue;
  });

  const changeValue = useCallback(
    function changeValue(value: T | ((old: T) => T), save = true) {
      setValue((prev) => {
        const newVal =
          typeof value === "function" ? (value as (old: T) => T)(prev) : value;
        if (!key) return newVal;

        if (save) {
          window.localStorage.setItem(key, JSON.stringify(newVal));
          setChanged(false);
        } else {
          setChanged(true);
        }
        return newVal;
      });
    },
    [key],
  );

  return [value, changeValue, changed] as const;
}

const columnTypes = {
  ColumnDummy: "column",
  Column: "column",
  ButtonsDummy: "buttons",
  Buttons: "buttons",
  DropdownDummy: "dropdown",
  Dropdown: "dropdown",
} as const;

type ColumnType = ValueOf<typeof columnTypes>;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useColumnsFromChildren(children: ReactNode) {
  const table = useDataTable();

  const columns = Children.map(
    children as never,
    (child: { props: ColumnPropsGeneric; type?: { name: string } }) => {
      if (!child) return null;
      const name = child.type?.name ?? "NO EXISTS";
      return {
        columnType: ((name in columnTypes
          ? columnTypes[name as never]
          : undefined) ?? "NOT EXISTS") as ColumnType,
        ...child.props,
      } satisfies ColumnProps;
    },
  ).filter((col) => {
    if (!col) return false;
    if (col.columnType === ("NOT EXISTS" as ColumnType))
      console.error(`Invalid child component for DataTable, ignoring...`, col);
    return col.columnType;
  });

  // Columns reactivity limited to accessor and accessorAlias;
  useIsomorphicLayoutEffect(() => {
    table.setColumns(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.map((col) => getAccessor(col)).join(",")]);

  return columns;
}

export function useColumns(columns: ColumnProps[]) {
  const table = useDataTable();
  const tanstackColumns = table.table.getVisibleFlatColumns();

  const sortedColumns = columns.sort((a, b) => {
    const aOrder = table.view.order?.indexOf(getAccessor(a)) ?? -1;
    const bOrder = table.view.order?.indexOf(getAccessor(b)) ?? -1;

    if (aOrder === -1 && bOrder === -1) return 0;
    if (aOrder === -1) return 1;
    if (bOrder === -1) return -1;
    return aOrder - bOrder;
  });

  const columnsInfo = sortedColumns.map((props) => {
    const accessor = getAccessor(props);
    const col = tanstackColumns.find((col) => col.id === accessor);
    return {
      accessor,
      props,
      col,
    };
  });

  const title = columnsInfo.find((col) => col.props.title);
  if (title)
    title.col = table.table
      .getAllColumns()
      .find((col) => col.id === title.accessor);

  const visibleColumns = columnsInfo.filter(
    (col) => table.view.visibility?.[col.accessor] !== false,
  );
  return [visibleColumns, title] as const;
}

export type ViewSizes = "sm" | "md" | "lg";

type Visibilitys<T extends string | symbol | number = string> = {
  [k in ViewSizes]?: { [k in T | (string & {})]?: boolean };
};

type Orders = {
  [k in ViewSizes]?: string[];
};

export function useView<T extends string | symbol | number = string>(
  key: string | undefined,
  defaultVisibility?: Visibilitys<T>,
  viewSizes = true,
) {
  const [_defaultVisibility] = useState(defaultVisibility);
  const [size, setSize] = useState<ViewSizes>("lg");
  const [orders, setOrders, orderChanged] = useLocalStorage<Orders>(
    `table_${key ?? ""}_order`,
    {},
  );
  const [visibilitys, setVisibilitys, visibilityChanged] =
    useLocalStorage<Visibilitys>(
      `table_${key ?? ""}_columns`,
      _defaultVisibility ?? {},
    );
  const [sort, setSort, sortChanged] = useLocalStorage<SortingState>(
    `table_${key ?? ""}_sort`,
    [],
  );

  useIsomorphicLayoutEffect(() => {
    function onResize() {
      if (!viewSizes) return;

      if (window.innerWidth < 640) {
        setSize("sm");
      } else if (window.innerWidth < 1024) {
        setSize("md");
      } else {
        setSize("lg");
      }
    }

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [viewSizes]);

  const visibility = visibilitys[size] as VisibilityState;
  const order = orders[size];

  const save = useCallback(() => {
    setVisibilitys((v) => v, true);
    setOrders((o) => o, true);
    setSort((s) => s, true);
  }, [setVisibilitys, setOrders, setSort]);

  const changeOrder = useCallback(
    (order: Updater<string[]>, onSize = size) => {
      setOrders((prev) => {
        const newOrder =
          typeof order === "function" ? order(prev[onSize] ?? []) : order;
        return { ...prev, [onSize]: newOrder };
      }, false);
    },
    [setOrders, size],
  );

  const changeVisibility = useCallback(
    (visibility: Updater<VisibilityState>, onSize = size) => {
      setVisibilitys((prev) => {
        const newVisibility =
          typeof visibility === "function"
            ? visibility((prev[onSize] as VisibilityState) ?? {})
            : visibility;
        return { ...prev, [onSize]: newVisibility };
      }, false);
    },
    [setVisibilitys, size],
  );

  const toggleVisibility = useCallback(
    (col: string, value: boolean, size: ViewSizes) => {
      changeVisibility((p) => {
        p = p ?? {};
        p[col] = value;
        return p;
      }, size);
    },
    [changeVisibility],
  );

  const getIsVisible = useCallback(
    (col: string, size: ViewSizes) => {
      return visibilitys[size]?.[col] ?? true;
    },
    [visibilitys],
  );

  const changeSort = useCallback(
    (sort: Updater<SortingState>) => {
      setSort((prev) => {
        const newSort = typeof sort === "function" ? sort(prev) : sort;
        return newSort;
      }, false);
    },
    [setSort],
  );

  const reset = useCallback(
    (onSize = size) => {
      changeVisibility(
        () => _defaultVisibility?.[onSize ?? size] as VisibilityState,
        onSize ?? size,
      );
      changeOrder(() => [], onSize ?? size);
      setSort(() => [], false);
    },
    [size, changeVisibility, changeOrder, setSort, _defaultVisibility],
  );

  const a = useMemo(
    () => ({
      order,
      orders,
      getIsVisible,
      visibility,
      size,
      viewSizes,
      changeOrder,
      changeVisibility,
      reset,
      toggleVisibility,
      sort,
      changeSort,
      isChanged: key && (orderChanged || visibilityChanged || sortChanged),
      save,
    }),
    [
      changeOrder,
      changeVisibility,
      getIsVisible,
      key,
      order,
      orderChanged,
      orders,
      reset,
      viewSizes,
      save,
      changeSort,
      size,
      sort,
      sortChanged,
      toggleVisibility,
      visibility,
      visibilityChanged,
    ],
  );

  return a;
}

type GetRow<T> =
  T extends Array<infer K extends Record<string, unknown>>
    ? K extends { subRows: unknown }
      ? { "Provide a type on useTable": true }
      : K
    : never;

export interface UseTable<TRow = Record<string, unknown>> {
  table: Table<TRow>;
  tableRef: React.RefObject<HTMLTableElement>;
  setColumns: Dispatch<SetStateAction<ColumnProps[]>>;
  columns: ColumnProps[];
  globalFilter: string;
  getRows: () => Row<TRow>[];
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  view: ReturnType<typeof useView>;
  prerender?: boolean;
  isEmpty: boolean;
  isLoading: boolean;
  paginationDefault?: number;
  reduce: <T>(
    column: (acc: T, row: TRow) => unknown,
    initial: T,
    options?: { onlyVisible?: boolean },
  ) => T;
  sum: (
    column: keyof TRow | ((row: TRow) => unknown),
    options?: { onlyVisible?: boolean },
  ) => number;
}

function genericSearch(
  row: Row<Record<string, unknown>>,
  globalFilter: string,
) {
  const res = row.getVisibleCells().some((cell) => {
    if (!globalFilter) return true;
    const value = cell.getValue();
    if (value instanceof Date) {
      return (
        format(value, "dd-MM-yyyy").includes(globalFilter) ||
        format(value, "dd/MM/yyyy").includes(globalFilter)
      );
    } else if (typeof value === "number") {
      return (
        value.toString().toUpperCase().includes(globalFilter.toUpperCase()) ||
        formatNumber(value).toUpperCase().includes(globalFilter.toUpperCase())
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (typeof value === "string") {
      return value.toUpperCase().includes(globalFilter.toUpperCase());
    }
    return value === globalFilter;
  });

  return res;
}

const emptyArray: Array<Record<string, unknown>> = [];
export function useTable<
  T extends Array<Record<string, unknown>>,
  TRow = GetRow<T>,
>({
  data,
  minDepth = 0,
  maxDepth = 100,
  prerender = true,
  filterFromLeafRows = true,
  pagination,
  view,
  filter,
  defaultExpanded,
  sort,
}: {
  key?: string;
  data: T | undefined;
  minDepth?: number;
  maxDepth?: number;
  filterFromLeafRows?: boolean;
  prerender?: boolean;
  pagination?: number;
  filter?: (
    row: Row<TRow>,
    search: string,
    filter: (row: Row<TRow>) => boolean,
  ) => boolean;
  sort?: Record<string, (a: TRow, b: TRow) => number>;
  view?: ReturnType<typeof useView>;
  defaultExpanded?: ExpandedState;
}) {
  const tableRef = useRef<HTMLTableElement>(null);
  const [columns, setColumns] = useState<Array<ColumnProps>>([]);
  const [paginationState, setPaginationState] = useState<PaginationState>(
    () => ({
      pageSize: pagination ?? 10000,
      pageIndex: 0,
    }),
  );
  const [search, setSearch] = useState("");

  const [expanded, setExpanded] = useState<ExpandedState>(
    defaultExpanded ?? true,
  );
  const defaultView = useView(undefined);

  const autoDepthSort = useCallback(
    (
      a: Row<Record<string, unknown>>,
      b: Row<Record<string, unknown>>,
      columnId: string,
    ) => {
      if (a.depth < minDepth || b.depth < minDepth) return 0;

      const sortFn = sort?.[columnId as never] as unknown as (
        a: unknown,
        b: unknown,
      ) => number;
      if (sortFn) return sortFn(a.original, b.original);

      if (
        a.getValue(columnId) instanceof Date &&
        b.getValue(columnId) instanceof Date
      ) {
        return sortingFns.datetime(a, b, columnId);
      }
      return sortingFns.alphanumeric(a, b, columnId);
    },
    [minDepth, sort],
  );

  const tanstackColumns = useMemo(
    () =>
      columns.map((col) => ({
        accessorKey: getAccessor(col),
        header: col.label,
        sortingFn: autoDepthSort,
      })),
    [columns, autoDepthSort],
  );

  const globalFilterFn = useCallback(
    (row: Row<Record<string, unknown>>) => {
      if (row.depth < minDepth) return true;
      if (filter)
        return filter(row as never, search, ((
          row: Row<Record<string, unknown>>,
        ) => genericSearch(row, search)) as never);

      return genericSearch(row, search);
    },
    [minDepth, filter, search],
  );

  const table = useReactTable({
    data: data ?? emptyArray,
    columns: tanstackColumns,
    state: {
      sorting: view?.sort ?? defaultView.sort,
      columnVisibility: view?.visibility ?? defaultView.visibility,
      expanded,
      pagination: paginationState,
      globalFilter: search,
    },
    maxLeafRowFilterDepth: maxDepth,
    filterFromLeafRows,
    globalFilterFn,
    onGlobalFilterChange: setSearch,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    onPaginationChange: setPaginationState,
    getSubRows: useCallback(
      (row: Record<string, unknown>) => row.subRows,
      [],
    ) as never,
    onColumnVisibilityChange:
      view?.changeVisibility ?? defaultView.changeVisibility,
    enableRowSelection: true,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (sort) =>
      (view?.changeSort ?? defaultView.changeSort)(sort),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    sortingFns: {
      auto: autoDepthSort,
    },
    getSortedRowModel: getSortedRowModel(),
  });

  const getRows = useCallback(() => {
    return table.getRowModel().rows;
  }, [table]);

  const reduce = useCallback(
    <T>(
      column: (acc: T, row: TRow) => unknown,
      initial: T,
      options?: { onlyVisible?: boolean },
    ) => {
      const { onlyVisible = false } = options ?? {};

      const rows = onlyVisible
        ? table.getRowModel().rows
        : table.getCoreRowModel().rows;

      return rows.reduce(
        (acc, row) => column(acc, row.original as never) as never,
        initial,
      );
    },
    [table],
  );

  const sum = useCallback(
    (
      column: keyof TRow | ((row: TRow) => unknown),
      options?: { onlyVisible?: boolean },
    ) => {
      return reduce(
        (acc, row) => {
          const value =
            typeof column === "function" ? column(row) : row[column];
          if (typeof value === "number") return acc + value;
          return acc;
        },
        0,
        options,
      );
    },
    [reduce],
  );

  type DateTable = Omit<
    typeof DataTable,
    "Root" | "Column" | "Rows" | "Buttons" | "Dropdown" | "Action"
  > & {
    Root: (props: DataTableRootProps<TRow>) => JSX.Element;
    Rows: (props: RowsProps<TRow>) => JSX.Element;
    Column: (props: ColumnPropsGeneric<TRow>) => null;
    Buttons: (
      props: ColumnPropsGeneric<TRow> & { responsive?: boolean },
    ) => null;
    Dropdown: (props: ColumnPropsGeneric<TRow>) => null;
    Action: (props: ActionProps<TRow>) => JSX.Element;
  };

  const returnValue = {
    table,
    tableRef,
    setColumns,
    columns,
    getRows,
    view: view ?? defaultView,
    prerender,
    isEmpty: data?.length === 0,
    isLoading: data === undefined,
    globalFilter: search,
    setGlobalFilter: setSearch,
    paginationDefault: pagination,
    reduce: reduce as UseTable<Record<string, unknown>>["reduce"],
    sum: sum as UseTable<Record<string, unknown>>["sum"],
  } satisfies UseTable as UseTable<TRow>;

  return [returnValue, DataTable as DateTable] as const;
}

export const DataTableContext = createContext<UseTable>(
  null as unknown as UseTable,
);

export const useDataTable = () => useContext(DataTableContext);
