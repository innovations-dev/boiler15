"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function BillingUsage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>API Calls</span>
            <span className="text-muted-foreground">50/100</span>
          </div>
          <Progress value={50} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Storage</span>
            <span className="text-muted-foreground">2GB/5GB</span>
          </div>
          <Progress value={40} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Team Members</span>
            <span className="text-muted-foreground">3/5</span>
          </div>
          <Progress value={60} />
        </div>
      </CardContent>
    </Card>
  );
}
