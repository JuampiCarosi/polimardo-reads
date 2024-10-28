/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ViewSizes, useDataTable } from "@/components/ui/datatable/hooks";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Eye,
  EyeOff,
  GripHorizontal,
  Laptop,
  Monitor,
  Settings2,
  Smartphone,
} from "lucide-react";
import {
  type ReactNode,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

export function ViewOptions({ className }: { className?: string }) {
  const { view, table } = useDataTable();
  const [size, setSize] = useState<ViewSizes>("lg");

  useEffect(() => {
    setSize(view.size);
  }, [view.size]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("ml-auto flex h-8 bg-white", className)}
        >
          <Settings2 className="mr-2 h-4 w-4" />
          Vista
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="grid gap-2">
          <div className="mb-1 flex items-center justify-between">
            <h4 className="font-medium leading-none">Columnas</h4>
            <Button
              size="sm"
              variant="link"
              className="text-slate-400"
              onClick={() => view.reset(size)}
            >
              Reset
            </Button>
          </div>

          <label className="pl-0.5 text-xs font-semibold text-slate-600">
            Ordenado Por
          </label>
          <div className="flex gap-2 overflow-hidden">
            <Select
              value={view.sort[0]?.id ?? "__none__"}
              onValueChange={(col) =>
                view.changeSort(
                  col === "__none__" ? [] : [{ id: col, desc: false }],
                )
              }
            >
              <SelectTrigger className="h-8 truncate">
                <SelectValue placeholder="Columna" />
                <SelectContent>
                  <SelectItem value="__none__">Sin orden</SelectItem>
                  {table
                    .getAllColumns()
                    .filter(
                      (column) => typeof column.accessorFn !== "undefined",
                    )
                    .map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.columnDef.header?.toString()}
                      </SelectItem>
                    ))}
                </SelectContent>
              </SelectTrigger>
            </Select>

            {view.sort[0] && (
              <Select
                value={view.sort[0]?.desc ? "desc" : "asc"}
                onValueChange={(way) =>
                  view.sort[0]?.id &&
                  view.changeSort([
                    { id: view.sort[0]?.id, desc: way === "desc" },
                  ])
                }
              >
                <SelectTrigger className="h-8 w-20 min-w-max flex-shrink-0">
                  <SelectValue placeholder="Orden" />
                  <SelectContent>
                    <SelectItem value="asc">Asc</SelectItem>
                    <SelectItem value="desc">Desc</SelectItem>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            )}
          </div>

          <label className="mt-2 pl-0.5 text-xs font-semibold text-slate-600">
            Columnas
          </label>
          <Tabs
            value={size}
            onValueChange={(value) => setSize(value as ViewSizes)}
          >
            {view.viewSizes && (
              <TabsList className="h-8 w-full">
                <TabsTrigger className="h-6 w-full" value="sm">
                  <Smartphone
                    className={cn(
                      "h-3.5 w-3.5",
                      "sm" === view.size && "!stroke-[3px] !text-blue-500",
                    )}
                  />
                </TabsTrigger>
                <TabsTrigger className="h-6 w-full" value="md">
                  <Laptop
                    className={cn(
                      "h-[18px] w-[18px]",
                      "md" === view.size && "!stroke-[3px] !text-blue-500",
                    )}
                  />
                </TabsTrigger>
                <TabsTrigger className="h-6 w-full" value="lg">
                  <Monitor
                    className={cn(
                      "h-4 w-4",
                      "lg" === view.size && "!stroke-[3px] !text-blue-500",
                    )}
                  />
                </TabsTrigger>
              </TabsList>
            )}
            <TabsContent value="sm">
              <ColumnVisibility size="sm" />
            </TabsContent>
            <TabsContent value="md">
              <ColumnVisibility size="md" />
            </TabsContent>
            <TabsContent value="lg">
              <ColumnVisibility size="lg" />
            </TabsContent>
          </Tabs>

          {view.isChanged && (
            <div className="mt-4 flex w-full items-center justify-between">
              <span className="text-xs text-slate-500">¿Fijar cambios?</span>
              <Button
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => view.save()}
              >
                Guardar
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const ColumnVisibility = ({ size }: { size: "sm" | "md" | "lg" }) => {
  const { table, view } = useDataTable();

  const columns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined")
    .sort((a, b) => {
      const aOrder = view.orders[size]?.indexOf(a.id) ?? -1;
      const bOrder = view.orders[size]?.indexOf(b.id) ?? -1;
      if (aOrder === -1 && bOrder === -1) return 0;
      if (aOrder === -1) return 1;
      if (bOrder === -1) return -1;
      return aOrder - bOrder;
    });

  const order = columns.map((column) => ({
    id: column.id,
    name: column.columnDef.header,
  }));

  function setItems(items: SetStateAction<SortableItemProps[]>) {
    view.changeOrder(
      (typeof items === "function" ? items(order) : items).map((i) => i.id),
      size,
    );
  }

  return (
    <div className="bg-white">
      <SortableList items={order} setItems={setItems}>
        {columns.map((col) => (
          <SortableColumn key={col.id} id={col.id}>
            <div className="flex grow items-center justify-between">
              <span
                className={cn(
                  !view.getIsVisible(col.id, size)
                    ? "text-slate-400/90"
                    : "text-slate-900",
                )}
              >
                {col.columnDef.header?.toString()}
              </span>
              {view.getIsVisible(col.id, size) ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => view.toggleVisibility(col.id, false, size)}
                >
                  <Eye className="h-4 w-4 text-slate-400/80" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => view.toggleVisibility(col.id, true, size)}
                >
                  <EyeOff className="h-4 w-4 text-slate-400/80" />
                </Button>
              )}
            </div>
          </SortableColumn>
        ))}
      </SortableList>
    </div>
  );
};

function SortableColumn(props: { id: string; children: ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative -mx-2 flex touch-none items-center gap-3 rounded-md bg-white px-2 py-0.5 text-sm leading-6 text-slate-700",
        isDragging && "z-50 bg-slate-100 shadow-lg shadow-slate-200",
      )}
      {...attributes}
      style={style}
    >
      <div
        {...props}
        {...listeners}
        className="-mx-1 flex h-6 w-6 items-center justify-center"
        ref={setNodeRef}
      >
        <GripHorizontal className="h-4 w-4 text-slate-400/80" />
      </div>
      {props.children}
    </div>
  );
}

type SortableItemProps = {
  id: string;
  [k: string]: unknown;
};

function SortableList({
  children,
  items,
  setItems,
}: {
  children: ReactNode;
  items: Array<SortableItemProps>;
  setItems: (fn: SetStateAction<SortableItemProps[]>) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event as {
      active: { id: string };
      over: { id: string };
    };

    if (active.id !== over.id) {
      setItems((items: SortableItemProps[]) => {
        const ids = items.map((item: SortableItemProps) => item.id);
        const oldIndex = ids.indexOf(active.id);
        const newIndex = ids.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}
