import { VStack } from "@navikt/ds-react";
import { useEffect } from "react";
import { useFetcher, useOutletContext } from "react-router";
import { PageHeader } from "~/components/PageHeader";
import { BatchHistory } from "~/components/dashboard/BatchHistory";
import { DashboardStats } from "~/components/dashboard/DashboardStats";
import type { IOrganisationUnit } from "~/types/user";
import type { loader as statsLoader } from "./api.dashboard-stats";
import type { loader as batchesLoader } from "./api.dashboard-batches";

function HomeDashboard() {
  const stats = useFetcher<typeof statsLoader>();
  const batches = useFetcher<typeof batchesLoader>();
  const loadStats = stats.load;
  const loadBatches = batches.load;

  useEffect(() => {
    void loadStats("/_dashboard/stats");
    void loadBatches("/_dashboard/batches");
  }, [loadStats, loadBatches]);

  const batchesLoading = batches.state !== "idle" || batches.data === undefined;

  return (
    <>
      <DashboardStats
        {...stats.data?.stats}
        paidOrders={batches.data?.paidOrders ?? undefined}
        paidLoading={batchesLoading}
        paidError={batches.data?.paidOrders === null}
        loading={stats.state !== "idle" || stats.data === undefined}
        error={stats.data?.stats === null}
      />
      <BatchHistory
        batches={batches.data?.batches ?? []}
        loading={batchesLoading}
        error={batches.data?.batches === null}
      />
    </>
  );
}

export default function Home() {
  const selectedOrg = useOutletContext<IOrganisationUnit>();

  return (
    <VStack gap="space-24">
      <PageHeader
        title={`Dashboard - ${selectedOrg.name}`}
        description="Oversikt over ordrer og aktivitet"
      />
      <HomeDashboard key={selectedOrg.organisationNumber} />
    </VStack>
  );
}
