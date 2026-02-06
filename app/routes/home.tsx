import { VStack } from "@navikt/ds-react";
import { PageHeader } from "~/components/PageHeader";
import {
  type BatchData,
  BatchHistory,
} from "~/components/dashboard/BatchHistory";
import { DashboardStats } from "~/components/dashboard/DashboardStats";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext } from "react-router";
import type { IOrder } from "~/types/order";
import type { IOrganisationUnit } from "~/types/user";
import { selectOrgCookie } from "~/utils/cookie";
import OrderApi from "~/api/OrderApi";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const selectedOrg = await selectOrgCookie.parse(cookieHeader);

  // TODO: Change to this year after testing?
  const [
    storedCount,
    sendErrorCount,
    acceptErrorCount,
    updateErrorCount,
    errorCount,
    ordersResponse,
  ] = await Promise.all([
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "STORED", "14"),
    OrderApi.getCountByStatus(
      selectedOrg.organisationNumber,
      "SEND_ERROR",
      // "YEAR",
    ),
    OrderApi.getCountByStatus(
      selectedOrg.organisationNumber,
      "ACCEPT_ERROR",
      // "YEAR",
    ),
    OrderApi.getCountByStatus(
      selectedOrg.organisationNumber,
      "UPDATE_ERROR",
      // "YEAR",
    ),
    // OrderApi.getCountByStatus(selectedOrg.organisationNumber, "ERROR", "YEAR"),
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "ERROR"),
    // OrderApi.getOrders(selectedOrg.organisationNumber, undefined, "YEAR"),
    OrderApi.getOrders(selectedOrg.organisationNumber, undefined),
  ]);

  const pendingOrders = storedCount.success ? storedCount.data || 0 : 0;
  const errorOrders =
    (sendErrorCount.success ? sendErrorCount.data || 0 : 0) +
    (acceptErrorCount.success ? acceptErrorCount.data || 0 : 0) +
    (updateErrorCount.success ? updateErrorCount.data || 0 : 0) +
    (errorCount.success ? errorCount.data || 0 : 0);

  // For total orders, you might want to fetch all statuses or use a different endpoint
  // For now, we'll sum the counts we have (you may need to add more statuses)
  const totalOrders = pendingOrders + errorOrders;

  // Process orders into batches by date
  const orders = ordersResponse.success ? ordersResponse.data || [] : [];
  const batches = processOrdersIntoBatches(orders);

  return {
    pendingOrders,
    errorOrders,
    totalOrders,
    batches,
  };
};

// Group orders by date and calculate batch statistics
function processOrdersIntoBatches(orders: IOrder[]) {
  // Group orders by date (YYYY-MM-DD)
  const ordersByDate = new Map<string, IOrder[]>();

  orders.forEach((order) => {
    const date = new Date(order.createdDate).toISOString().split("T")[0];
    if (!ordersByDate.has(date)) {
      ordersByDate.set(date, []);
    }
    ordersByDate.get(date)!.push(order);
  });

  // Convert to batch statistics
  // Last 14 days
  return Array.from(ordersByDate.entries())
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

//TODO: add toaster from novari components

export default function Home() {
  const selectedOrg = useOutletContext<IOrganisationUnit>();
  const { pendingOrders, errorOrders, totalOrders, batches } = useLoaderData<{
    pendingOrders: number;
    errorOrders: number;
    totalOrders: number;
    batches: BatchData[];
  }>();

  return (
    <VStack gap="6">
      <PageHeader
        title={`Dashboard - ${selectedOrg.name}`}
        description="Oversikt over ordrer og aktivitet"
      />

      {/* Stats Cards */}
      <DashboardStats
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
        errorOrders={errorOrders}
      />

      {/* Batch History Box */}
      <BatchHistory batches={batches} />
    </VStack>
  );
}
