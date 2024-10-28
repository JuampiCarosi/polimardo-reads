import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export function Pill({
  children,
  className,
  ...pillProps
}: { children: React.ReactNode; className?: string } & VariantProps<
  typeof pillVariants
>) {
  return (
    <div className={cn(pillVariants(pillProps), className)}>
      <span>{children}</span>
    </div>
  );
}

const pillVariants = cva(
  "inline-flex justify-center rounded-full px-2 text-center text-xs",
  {
    variants: {
      color: {
        gray: "bg-gray-200 text-gray-800",
        yellow: "bg-yellow-200 text-yellow-800",
        green: "bg-green-200 text-green-800",
        red: "bg-red-200 text-red-800",
        rose: "bg-rose-200 text-rose-800",
        blue: "bg-blue-200 text-blue-800",
      },
    },
  },
);
