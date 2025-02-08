"use client";

import {
  createContext,
  Dispatch,
  forwardRef,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { VariantProps } from "class-variance-authority";
import { ChevronRight, Ellipsis } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BreadCrumbProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonVariants> {
  orientation?: "horizontal" | "vertical";
}

type BreadCrumbContextProps = {
  activeIndex: number;
  orientation: "horizontal" | "vertical";
  setActiveIndex: (activeIndex: number) => void;
  value: number[];
  onValueChange: Dispatch<SetStateAction<number[]>>;
  onPrevValueChange: Dispatch<SetStateAction<number[]>>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setTarget: (target: number) => void;
} & BreadCrumbProps;

const BreadCrumbContext = createContext<BreadCrumbContextProps | null>(null);

const useBreadcrumb = () => {
  const context = useContext(BreadCrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadCrumb");
  }
  return context;
};

/**
 * Breadcrumb Docs: {@link: https://shadcn-extension.vercel.app/docs/breadcrumb}
 */
export const BreadCrumb = ({
  className,
  orientation = "horizontal",
  variant,
  dir,
  size,
  children,
  ...props
}: BreadCrumbProps) => {
  const [value, setValue] = useState<number[]>([]);
  const [prevValue, setPrevValue] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const length = value.length - 1;

      const moveNext = () => {
        const nextIndex = activeIndex + 1 > length ? 0 : activeIndex + 1;
        setActiveIndex(value[nextIndex]);
      };

      const movePrev = () => {
        const currentIndex = value.indexOf(activeIndex) - 1;
        const prevIndex = currentIndex < 0 ? length : currentIndex;
        setActiveIndex(value[prevIndex]);
      };

      switch (e.key) {
        case "ArrowDown":
          if (orientation === "vertical") {
            moveNext();
          }
          break;
        case "ArrowUp":
          if (orientation === "vertical") {
            movePrev();
          }
          break;
        case "ArrowRight":
          if (orientation === "horizontal") {
            if (dir === "rtl") {
              movePrev();
              return;
            }
            moveNext();
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal") {
            if (dir === "rtl") {
              moveNext();
              return;
            }
            movePrev();
          }
          break;
      }

      if (e.key === "Escape") {
        if (activeIndex !== -1) {
          if (prevValue.length > 0) setValue(prevValue);
          setOpen(false);
          if (
            value.includes(activeIndex) &&
            !prevValue.includes(activeIndex) &&
            prevValue.length > 0
          ) {
            setActiveIndex(target);
            return;
          }
          setActiveIndex(-1);
        }
      } else if (e.key === "Enter" && activeIndex === target) {
        if (prevValue.length > 0) setValue(prevValue);
        setOpen(!open);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeIndex, value, prevValue]
  );

  return (
    <BreadCrumbContext.Provider
      value={{
        variant,
        size,
        orientation,
        activeIndex,
        value,
        onValueChange: setValue,
        onPrevValueChange: setPrevValue,
        setActiveIndex,
        open,
        onOpenChange: setOpen,
        setTarget,
      }}
    >
      <div
        tabIndex={0}
        onKeyDownCapture={handleKeyDown}
        className={cn(
          "flex flex-wrap items-center justify-center gap-2",
          {
            "flex-row": orientation === "horizontal",
            "flex-col": orientation === "vertical",
          },
          className
        )}
        dir={dir}
        {...props}
      >
        {children}
      </div>
    </BreadCrumbContext.Provider>
  );
};

BreadCrumb.displayName = "BreadCrumb";

interface BreadCrumbItemProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  isLast?: boolean;
}

export const BreadCrumbItem = forwardRef<
  HTMLAnchorElement,
  BreadCrumbItemProps
>(({ href, children, className, isLast, ...props }, ref) => {
  return (
    <>
      <Link
        ref={ref}
        href={href}
        className={cn(
          "text-sm text-muted-foreground transition-colors hover:text-foreground",
          isLast && "pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </Link>
      {!isLast && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </>
  );
});

BreadCrumbItem.displayName = "BreadCrumbItem";

export const BreadCrumbSeparator = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => {
  const { orientation, dir } = useBreadcrumb();
  return (
    <span
      ref={ref}
      {...props}
      dir={dir}
      data-orientation={orientation}
      className={cn(
        "flex size-4 items-center justify-center data-[orientation='horizontal']:rotate-0 data-[orientation='vertical']:rotate-90 rtl:data-[orientation='horizontal']:rotate-180"
      )}
    >
      {children ? (
        children
      ) : (
        <ChevronRight className={cn("h-4 w-4", className)} />
      )}
      <span className="sr-only">next page</span>
    </span>
  );
});

BreadCrumbSeparator.displayName = "BreadCrumbSeparator";

export const BreadCrumbEllipsis = forwardRef<
  HTMLSpanElement,
  { index: number } & React.HTMLAttributes<HTMLSpanElement>
>(({ className, index, ...props }, ref) => {
  const { activeIndex, onValueChange, setTarget } = useBreadcrumb();
  const isSelected = activeIndex === index;
  useEffect(() => {
    setTarget(index);
    onValueChange((prev) => {
      if (prev.includes(index)) {
        return prev;
      }
      const arr = [...prev, index];
      return arr.sort((a, b) => Number(a) - Number(b));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, onValueChange]);
  return (
    <span
      ref={ref}
      aria-hidden
      className={cn("", className, isSelected ? "bg-muted" : "")}
      {...props}
    >
      <Ellipsis className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
});

BreadCrumbEllipsis.displayName = "BreadCrumbEllipsis";

export function BreadCrumbPopover({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open, onOpenChange } = useBreadcrumb();
  return (
    <Popover open={open} onOpenChange={onOpenChange} {...props}>
      {children}
    </Popover>
  );
}

BreadCrumbPopover.displayName = "BreadCrumbPopover";

export const BreadCrumbTrigger = PopoverTrigger;

BreadCrumbTrigger.displayName = "BreadCrumbTrigger";

export const BreadCrumbContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ children, ...props }, ref) => {
  const { orientation } = useBreadcrumb();

  return (
    <PopoverContent
      {...props}
      side={orientation === "horizontal" ? "bottom" : "right"}
      ref={ref}
    >
      {children}
    </PopoverContent>
  );
});

BreadCrumbContent.displayName = "BreadCrumbContent";
