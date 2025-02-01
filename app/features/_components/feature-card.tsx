import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
}: FeatureCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <div className="mb-4">
          <Icon
            className={cn(
              "h-8 w-8 transition-colors",
              "text-primary group-hover:text-primary/80"
            )}
          />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
