import { Card } from "components/ui/card";
import { CardSkeleton } from "@/custom-components/card-skeleton";
import { DashboardHeader } from "@/custom-components/header";
import { DashboardShell } from "@/custom-components/shell";

export default function DashboardSettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  );
}
