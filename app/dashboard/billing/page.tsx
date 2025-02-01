import { Suspense } from "react";
import { CreditCard, Package, Receipt } from "lucide-react";

import { BillingForm } from "@/app/dashboard/_components/billing/billing-form";
import { BillingInfo } from "@/app/dashboard/_components/billing/billing-info";
import { BillingUsage } from "@/app/dashboard/_components/billing/billing-usage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Billing Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Free Tier</div>
            <p className="text-xs text-muted-foreground">
              Basic features included
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">Due on --/--/----</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payment Method
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">None</div>
            <p className="text-xs text-muted-foreground">
              Add a payment method
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<div>Loading...</div>}>
          <BillingInfo />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <BillingUsage />
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <BillingForm />
      </Suspense>
    </div>
  );
}
