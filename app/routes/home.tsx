import { VStack } from "@navikt/ds-react";
import { PageHeader } from "~/components/PageHeader";
import {
  type BatchData,
  BatchHistory,
} from "~/components/dashboard/BatchHistory";
import { DashboardStats } from "~/components/dashboard/DashboardStats";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext } from "react-router";
import type { IClaim } from "~/types/claim";
import type { IOrganisationUnit } from "~/types/user";
import { selectOrgCookie } from "~/utils/cookie";
import ClaimApi from "~/api/ClaimApi";
import MeApi from "~/api/MeApi";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookieOrgNumber = await selectOrgCookie.parse(cookieHeader);

  // When no cookie (e.g. first visit), use first org from user
  const organisationNumber =
    cookieOrgNumber ??
    (await MeApi.fetchMe()).organisationUnits[0]?.organisationNumber;

  if (!organisationNumber) {
    throw new Response("Ingen organisasjon funnet", { status: 400 });
  }

  // TODO: Change to this this year after testing?
  const [
    storedCount,
    sendErrorCount,
    acceptErrorCount,
    updateErrorCount,
    errorCount,
    ordersResponse,
  ] = await Promise.all([
    ClaimApi.getCountByStatus(organisationNumber, "STORED", "14", undefined),
    ClaimApi.getCountByStatus(
      organisationNumber,
      "SEND_ERROR",
        // TODO: "YEAR",
      undefined,
      undefined,
    ),
    ClaimApi.getCountByStatus(
      organisationNumber,
      "ACCEPT_ERROR",
        // TODO: "YEAR",
      undefined,
      undefined,
    ),
    ClaimApi.getCountByStatus(
      organisationNumber,
      "UPDATE_ERROR",
      // TODO: "YEAR",
      undefined,
      undefined,
    ),
    ClaimApi.getCountByStatus(organisationNumber, "ERROR", undefined, undefined),
    ClaimApi.getClaims(organisationNumber, undefined, undefined, undefined),
  ]);

  const pendingOrders = storedCount.success ? storedCount.data || 0 : 0;
  const errorOrders =
    (sendErrorCount.success ? sendErrorCount.data || 0 : 0) +
    (acceptErrorCount.success ? acceptErrorCount.data || 0 : 0) +
    (updateErrorCount.success ? updateErrorCount.data || 0 : 0) +
    (errorCount.success ? errorCount.data || 0 : 0);

  const totalOrders = pendingOrders + errorOrders;

  const orders = ordersResponse.success ? ordersResponse.data || [] : [];
  const batches = processOrdersIntoBatches(orders);

  return {
    pendingOrders,
    errorOrders,
    totalOrders,
    batches,
  };
};

function processOrdersIntoBatches(orders: IClaim[]) {
  const ordersByTimestamp = new Map<string, IClaim[]>();

  orders.forEach((order) => {
    const timestamp = order.createdDate;
    if (!ordersByTimestamp.has(timestamp)) {
      ordersByTimestamp.set(timestamp, []);
    }
    ordersByTimestamp.get(timestamp)!.push(order);
  });

  return Array.from(ordersByTimestamp.entries())
    .map(([date, dateOrders]) => {
      const totalRecords = dateOrders.length;
      const sent = dateOrders.filter(
        (o) =>
          o.claimStatus === "SENT" ||
          o.claimStatus === "ACCEPTED" ||
          o.claimStatus === "ISSUED" ||
          o.claimStatus === "PAID" ||
          o.claimStatus === "CREDITED",
      ).length;
      const errors = dateOrders.filter(
        (o) =>
          o.claimStatus === "SEND_ERROR" ||
          o.claimStatus === "ACCEPT_ERROR" ||
          o.claimStatus === "UPDATE_ERROR" ||
          o.claimStatus === "ERROR",
      ).length;
      const stored = dateOrders.filter(
        (o) => o.claimStatus === "STORED",
      ).length;
      const cancelled = dateOrders.filter(
        (o) => o.claimStatus === "CANCELLED",
      ).length;

      return {
        date,
        totalRecords,
        sent,
        errors,
        stored,
        cancelled,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date)) // Sort by date descending (newest first)
    .slice(0, 14);
}

export default function Home() {
  const selectedOrg = useOutletContext<IOrganisationUnit>();
  const { pendingOrders, errorOrders, totalOrders, batches } = useLoaderData<{
    pendingOrders: number;
    errorOrders: number;
    totalOrders: number;
    batches: BatchData[];
  }>();

  return (
    <VStack gap="space-24">
      <PageHeader
        title={`Dashboard - ${selectedOrg.name}`}
        description="Oversikt over ordrer og aktivitet"
      />

      <DashboardStats
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
        errorOrders={errorOrders}
      />

      <BatchHistory batches={batches} />
    </VStack>
  );
}
