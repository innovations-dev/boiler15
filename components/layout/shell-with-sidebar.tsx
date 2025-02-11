import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ShellWithSidebarProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  children: React.ReactNode;
}

export function ShellWithSidebar({
  header,
  sidebar,
  breadcrumbs,
  children,
}: ShellWithSidebarProps) {
  return (
    <div className="flex min-h-full flex-col">
      {header}
      <div className="flex flex-1">
        {breadcrumbs && (
          <div className="sticky top-[var(--header-height)] z-20 h-14 w-full border-b bg-background">
            {breadcrumbs}
          </div>
        )}
        <div className="container relative flex flex-1">
          <aside
            className={cn(
              "fixed top-[var(--header-height)] z-30 hidden h-[calc(100vh-var(--header-height))] w-[240px] border-r lg:block",
              breadcrumbs && "top-[calc(var(--header-height)+3.5rem)]"
            )}
          >
            <ScrollArea className="h-full py-6 pr-6">{sidebar}</ScrollArea>
          </aside>
          <div
            className={cn(
              "w-full pl-0 lg:pl-[240px]",
              breadcrumbs ? "mt-14" : "mt-6"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
