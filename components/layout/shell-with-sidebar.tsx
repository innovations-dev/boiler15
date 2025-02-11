import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="relative mt-20 flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        {header}
      </header>
      <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-8.5rem)] w-full shrink-0 border-r md:sticky md:block">
          <ScrollArea className="h-full py-6 pl-8 pr-6 lg:py-8">
            {sidebar}
          </ScrollArea>
        </aside>
        <main className="flex w-full flex-col overflow-hidden px-4 py-6 md:px-6 lg:px-8 lg:py-8">
          {breadcrumbs}
          {children}
        </main>
      </div>
    </div>
  );
}
