import { HGrid } from "@navikt/ds-react";
import { NovariStatsLinkCard } from "novari-frontend-components";
import "novari-frontend-components/lib/index.css";
import { useHref } from "react-router";

interface DashboardStatsProps {
  paidOrders?: number;
  pendingOrders?: number;
  errorOrders?: number;
  loading?: boolean;
  error?: boolean;
  paidLoading?: boolean;
  paidError?: boolean;
}

export function DashboardStats({
  paidOrders,
  pendingOrders,
  errorOrders,
  loading = false,
  error = false,
  paidLoading = loading,
  paidError = error,
}: DashboardStatsProps) {
  const historyHref = useHref("/historikk");
  const pendingHref = useHref("/send");
  const errorsHref = useHref(
    "/historikk?status=ACCEPT_ERROR,SEND_ERROR,UPDATE_ERROR,ERROR",
  );

  return (
    <HGrid gap="space-24" columns={{ xs: 1, md: 3 }}>
      <NovariStatsLinkCard
        content="Betalte ordrer siste 12 måneder"
        value={paidOrders}
        link={{ href: historyHref, name: "Se ordrehistorikk" }}
        loading={paidLoading}
        loadingTitle="Henter betalte ordrer"
        error={paidError && !paidLoading}
      />
      <NovariStatsLinkCard
        content="Ventende ordrer"
        value={pendingOrders}
        link={{ href: pendingHref, name: "Se ventende ordrer" }}
        loading={loading}
        loadingTitle="Henter ventende ordrer"
        error={error && !loading}
      />
      <NovariStatsLinkCard
        content="Antall feil"
        value={errorOrders}
        link={{ href: errorsHref, name: "Se feilede ordrer" }}
        loading={loading}
        loadingTitle="Henter antall feil"
        error={error && !loading}
      />
    </HGrid>
  );
}
