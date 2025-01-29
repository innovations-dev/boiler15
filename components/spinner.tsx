import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  className?: string;
  spinnerClassName?: string;
}

export function Spinner({
  size = 24,
  className,
  spinnerClassName,
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "flex min-h-[40px] w-full items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="flex aspect-square items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("animate-spin", spinnerClassName)}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    </div>
  );
}
