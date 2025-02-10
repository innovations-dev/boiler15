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
    <div className="relative flex min-h-screen flex-col">
      {header}
      <div className="flex-1">
        {breadcrumbs && (
          <div className="sticky top-[var(--header-height)] z-20 h-14 border-b bg-background">
            {breadcrumbs}
          </div>
        )}
        <div className="container relative flex-1">
          <aside
            className={cn(
              "fixed top-[var(--header-height)] z-30 hidden h-[calc(100vh-var(--header-height)-var(--footer-height)-3.5rem)] w-[240px] border-r lg:block",
              breadcrumbs &&
                "top-[calc(var(--header-height)+3.5rem)] h-[calc(100vh-var(--header-height)-var(--footer-height)-3.5rem)]"
            )}
          >
            <ScrollArea className="h-full py-6 pr-6">{sidebar}</ScrollArea>
          </aside>
          <main
            className={cn(
              "mt-24 flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] flex-col pl-0 lg:pl-[240px]",
              breadcrumbs &&
                "min-h-[calc(100vh-var(--header-height)-var(--footer-height))]"
            )}
          >
            <div className="flex-1">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
