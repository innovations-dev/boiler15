import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SettingsListSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 2 }).map((_, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <Skeleton className="h-7 w-32" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, settingIndex) => (
              <Card key={settingIndex}>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-6 w-48" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton className="h-4 w-full" />
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
