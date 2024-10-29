import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function Stars({
  rating,
  onClick,
}: {
  rating: number | undefined;
  onClick?: (rating: number | null) => Promise<void>;
}) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex">
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
            {[...Array(5)].map((_, i) => (
              <div
                className="px-0.5"
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => onClick?.(rating === i + 1 ? null : i + 1)}
                key={i}
              >
                <Star
                  className={cn(
                    `size-5 cursor-pointer fill-current text-gray-200`,
                    i < (rating ?? 0) && "text-yellow-500",
                    i < (hoverRating ?? 0) && "text-yellow-500",
                  )}
                  viewBox="0 0 24 24"
                  fill="none"
                />
              </div>
            ))}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            {rating ? `Tu calificación: ${rating}` : "Sin calificar"}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
