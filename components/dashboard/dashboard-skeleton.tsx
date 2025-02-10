import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-4">
          <Skeleton className="mb-2 h-4 w-[100px]" />
          <Skeleton className="h-8 w-[60px]" />
        </Card>
      ))}
    </div>
  );
}
