import { CardSkeleton } from "@/custom-components/card-skeleton";
import { DashboardHeader } from "@/custom-components/header";
import { DashboardShell } from "@/custom-components/shell";

export default function DashboardBillingLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  );
}
