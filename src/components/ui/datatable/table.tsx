import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/numbers";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { format, isValid } from "date-fns";
import type { HTMLProps, MouseEventHandler, ReactNode } from "react";
import { memo } from "react";
import { createContext, useContext } from "react";

interface TableContextType {
  condensed?: VariantProps<typeof cellVariants>["condensed"];
  rounded?: "all" | "perimeter" | "none" | undefined | null;
}
const TableContext = createContext<TableContextType | null>(null);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useTableContext = () => useContext(TableContext)!;

export interface TableProps extends TableContextType {
  tableProps?: HTMLProps<HTMLTableElement>;
  children?: ReactNode;
  className?: string;
  fixed?: boolean;
  tableRef?: React.Ref<HTMLTableElement> | null;
}

export function Table({
  children,
  className,
  rounded,
  condensed,
  tableProps,
  fixed = false,
  tableRef,
}: TableProps) {
  const ctx = useTableContext();
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: ` table tr.variant + tr > td {
                        border-top: 0;
                    }`,
        }}
      ></style>
      <TableContext.Provider
        value={{
          condensed: condensed ?? ctx?.condensed ?? false,
          rounded: rounded ?? ctx?.rounded ?? "perimeter",
        }}
      >
        <div
          className={cn("overflow-auto", {
            "sm:rounded-md": (rounded ?? ctx?.rounded) !== "none",
          })}
        >
          <table
            ref={tableRef}
            className={cn(
              "group/table table w-full border-separate border-spacing-0 bg-white",
              fixed && "table-fixed",
              className,
            )}
            {...tableProps}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    </>
  );
}

export interface TableHeadProps extends TableContextType {
  children?: ReactNode;
}

const TableHead = memo(function TableHead({
  children,
  condensed,
  rounded,
}: TableHeadProps) {
  const ctx = useTableContext();
  return (
    <TableContext.Provider
      value={{
        condensed: condensed ?? ctx.condensed,
        rounded: rounded ?? ctx.rounded,
      }}
    >
      <thead>{children}</thead>
    </TableContext.Provider>
  );
});

const columnVariants = cva(
  "whitespace-nowrap border-b border-t border-slate-150 bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-600",
  {
    variants: {
      rounded: {
        all: "sm:first-of-type:rounded-l-md sm:first-of-type:border-l sm:last-of-type:rounded-r-md sm:last-of-type:border-r",
        perimeter:
          "sm:first-of-type:rounded-tl-md sm:first-of-type:border-l sm:last-of-type:rounded-tr-md sm:last-of-type:border-r",
        none: "",
      },
      isNumber: {
        true: "text-right",
        false: "",
      },
      isDate: {
        true: "text-center",
      },
      align: {
        left: "text-left",
        center: "text-center",
        "center!": "text-center",
        right: "text-right",
        "right!": "text-right",
      },
    },
    compoundVariants: [],
    defaultVariants: {
      rounded: "perimeter",
      isNumber: false,
      isDate: false,
      align: "left",
    },
  },
);

export interface TableColumnProps
  extends TableContextType,
    VariantProps<typeof columnVariants> {
  children?: ReactNode;
  order?: "desc" | "asc" | "none";
  className?: string;
  thProps?: Omit<HTMLProps<HTMLTableCellElement>, "className">;
  colSpan?: number;
  accessor?: string;
  accessorAlias?: string;
}

const TableColumn = memo(function TableColumn({
  children,
  thProps,
  align,
  className,
  isDate,
  isNumber,
  rounded,
  colSpan,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accessor,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accessorAlias,
  ...rest
}: TableColumnProps) {
  const ctx = useTableContext();

  const variants = {
    rounded: rounded ?? ctx.rounded,
    isNumber: isNumber ?? false,
    isDate: isDate ?? false,
    align: align ?? "left",
  };

  return (
    <th
      className={columnVariants({ ...variants, className })}
      {...rest}
      colSpan={colSpan}
      {...thProps}
    >
      {children}
    </th>
  );
});

type TableBodyProps = TableHeadProps;
const TableBody = memo(function TableBody({
  children,
  condensed,
  rounded,
}: TableBodyProps) {
  const ctx = useTableContext();

  return (
    <TableContext.Provider
      value={{
        condensed: condensed ?? ctx.condensed,
        rounded: rounded ?? ctx.rounded,
      }}
    >
      <tbody>{children}</tbody>
    </TableContext.Provider>
  );
});

export const rowVariants = cva("group", {
  variants: {
    variant: {
      main: "font-semibold text-white",
      secondary: "font-semibold text-white",
      gray: "font-semibold text-gray-700",
      light: "font-semibold text-gray-700",
      dark: "font-semibold text-white",
      green: "font-semibold text-white",
      red: "font-semibold text-white",
      none: "text-slate-500 hover:bg-slate-300/20",
    },
    clickable: {
      true: "cursor-pointer",
    },
  },
  defaultVariants: {
    variant: "none",
    clickable: false,
  },
});

export interface TableRowProps
  extends VariantProps<typeof rowVariants>,
    TableContextType {
  trProps?: Omit<HTMLProps<HTMLTableRowElement>, "className" | "children">;
  children: ReactNode;
  className?: string;
  borderless?: boolean;
  onClick?: MouseEventHandler<HTMLTableRowElement>;
}

interface TableRowContextType {
  variant?: VariantProps<typeof rowVariants>["variant"];
}
const TableRowContext = createContext<TableRowContextType | null>(null);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useTableRowContext = () => useContext(TableRowContext)!;

const TableRow = memo(function TableRow({
  children,
  className,
  variant,
  condensed,
  rounded,
  borderless,
  onClick,
  trProps,
}: TableRowProps) {
  const ctx = useTableContext();

  return (
    <TableRowContext.Provider
      value={{
        variant: variant,
      }}
    >
      <TableContext.Provider
        value={{
          condensed: condensed ?? ctx.condensed,
          rounded: rounded ?? ctx.rounded,
        }}
      >
        <tr
          className={cn(
            { variant: (variant ?? "none") !== "none", borderless: borderless },
            rowVariants({ variant, clickable: Boolean(onClick) }),
            className,
          )}
          {...trProps}
          onClick={onClick}
        >
          {children}
        </tr>
      </TableContext.Provider>
    </TableRowContext.Provider>
  );
});

const cellVariants = cva(
  [
    "whitespace-nowrap border-slate-150 px-2.5 text-left text-[13px]",
    "border-t group-first:border-t-0 group-[.borderless]:border-t-0",
    "group-[.table-fixed]/table:truncate",
  ],
  {
    variants: {
      tabular: {
        true: "text-right  tabular-nums tracking-tight ",
      },
      truncate: {
        true: "overflow-hidden text-ellipsis whitespace-nowrap",
        false: "",
      },
      align: {
        center: "text-center  first-of-type:text-left",
        "center!": "text-center",
        right: "text-right first-of-type:text-left",
        "right!": "text-right",
        left: "text-left",
      },
      variant: {
        main: "border-0 bg-blue-800",
        secondary: "border-0 bg-blue-400",
        gray: "border-0 bg-gray-200",
        light: "border-0 bg-gray-100",
        dark: "border-0 bg-gray-800",
        green: "border-0 bg-green-600",
        red: "border-0 bg-red-600",
        none: "",
      },
      rounded: {
        all: "sm:first-of-type:rounded-l-md sm:last-of-type:rounded-r-md",
        perimeter: [
          "sm:first-of-type:border-l sm:last-of-type:border-r ",
          "group-last:border-b group-last:sm:first-of-type:rounded-bl-md group-last:sm:last-of-type:rounded-br-md",
          "print:border-l print:border-slate-400 print:last-of-type:border-r  group-last:print:first-of-type:rounded-bl-md group-last:print:last-of-type:rounded-br-md",
        ],
        none: "",
      },

      condensed: {
        sm: "py-[3px] sm:py-[1px]",
        md: "py-[3px] md:py-[1px]",
        lg: "py-[3px] lg:py-[1px]",
        xl: "py-[3px] xl:py-[1px]",
        true: "py-[1px]",
        false: "py-[3px]",
      },
    },
    compoundVariants: [
      {
        align: "center",
        variant: "none",
        className: "first-of-type:text-center",
      },
      {
        align: "right",
        variant: "none",
        className: "first-of-type:text-right",
      },
      {
        variant: "none",
        rounded: "all",
        className:
          "sm:first-of-type:rounded-tl-none sm:last-of-type:rounded-tr-none",
      },
    ],
    defaultVariants: {
      variant: "none",
      align: "left",
      truncate: false,
      condensed: false,
    },
  },
);

export interface TableCellProps
  extends Omit<HTMLProps<HTMLTableCellElement>, "className" | "children">,
    VariantProps<typeof cellVariants>,
    TableContextType {
  children?: ReactNode;
  className?: string;
  isNumber?: boolean;
  isDate?: boolean;
  accessor?: string;
  accessorAlias?: string;
}
const TableCell = memo(function TableCell({
  children,
  className,
  condensed,
  tabular,
  isNumber,
  truncate,
  rounded,
  isDate,
  variant,
  align,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accessor,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accessorAlias,
  ...rest
}: TableCellProps) {
  const ctx = useTableContext();
  const rowCtx = useTableRowContext();

  const variants = {
    ...rowCtx,
    align: align ?? (isDate ? "center" : isNumber ? "right" : null),
    condensed: condensed ?? ctx.condensed,
    tabular: tabular ?? isNumber ?? isDate,
    rounded: rounded ?? ctx.rounded,
    truncate,
    variant: variant ?? rowCtx?.variant,
  };

  let value = children;
  if (typeof children === "number" && isNumber) {
    value = formatNumber(children);
  }

  const date = children;
  if (date instanceof Date && isDate && isValid(date)) {
    value = format(date, "dd-MM-yyyy");
  }

  if (variant !== "none" && (!value || value === "-")) {
    value = "";
  }

  return (
    <td className={cn(cellVariants(variants), className)} {...rest}>
      {value ?? "-"}
    </td>
  );
});

const containerVariants = cva(
  "----pt-3 flex flex-col overflow-hidden sm:mx-5",
  {
    variants: {
      variant: {
        card: "overflow-auto border-y border-slate-100 bg-white shadow shadow-slate-150 sm:rounded-lg sm:border-x sm:px-3 sm:pb-4 sm:pt-1",
        island: "",
        narrow:
          "border-y border-slate-150 bg-white pb-0 shadow shadow-slate-150 sm:rounded-lg sm:border-x",
      },
    },
  },
);
const containerToTableVariant = {
  card: "all",
  island: "perimeter",
  narrow: "none",
} as const;

export interface TableCardProps extends VariantProps<typeof containerVariants> {
  children: ReactNode;
  className?: string;
}
export const TableContainer = ({
  children,
  variant = "card",
  className,
}: TableCardProps) => {
  return (
    <TableContext.Provider
      value={{
        condensed: false,
        rounded: containerToTableVariant[variant ?? "card"],
      }}
    >
      <div className={cn(containerVariants({ variant }), className)}>
        {children}
      </div>
    </TableContext.Provider>
  );
};

const TableContainerHeader = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ctx = useTableContext();
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 px-2 pb-2.5 pt-3 sm:px-0 lg:gap-4",
        { "sm:px-3": ctx.rounded === "none" },
        className,
      )}
    >
      {children}
    </div>
  );
};

Table.Head = TableHead;
Table.Column = TableColumn;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;

TableContainer.Header = TableContainerHeader;
