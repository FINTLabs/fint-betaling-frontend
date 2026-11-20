import type { LoaderFunctionArgs } from "react-router";
import ClaimApi from "~/api/ClaimApi";
import type { BatchData } from "~/components/dashboard/BatchHistory";
import type { IClaim } from "~/types/claim";
import { getDashboardOrganizationNumber } from "~/utils/dashboardOrganization.server";

const orderDateFormatter = new Intl.DateTimeFormat("sv-SE", {
  dateStyle: "short",
  timeZone: "Europe/Oslo",
});

export async function loader({ request }: LoaderFunctionArgs) {
  const organisationNumber = await getDashboardOrganizationNumber(request);
  const orders = await ClaimApi.getClaims(request, organisationNumber);

  if (!orders.success) {
    return { batches: null, paidOrders: null };
  }

  const claims = orders.data ?? [];
  const today = orderDateFormatter.format(new Date());
  const [year, month, day] = today.split("-").map(Number);
  const lastDayOfMonth = new Date(Date.UTC(year - 1, month, 0)).getUTCDate();
  const start = new Date(
    Date.UTC(year - 1, month - 1, Math.min(day, lastDayOfMonth)),
  )
    .toISOString()
    .slice(0, 10);
  const paidOrders = claims.reduce((count, claim) => {
    if (claim.claimStatus !== "PAID") return count;

    const orderDate = claim.createdDate.slice(0, 10);
    return orderDate >= start && orderDate <= today ? count + 1 : count;
  }, 0);

  return { batches: summarizeBatches(claims), paidOrders };
}

function summarizeBatches(orders: IClaim[]): BatchData[] {
  const batches = new Map<string, BatchData>();

  for (const { createdDate, claimStatus } of orders) {
    let batch = batches.get(createdDate);
    if (!batch) {
      batch = {
        date: createdDate,
        totalRecords: 0,
        sent: 0,
        errors: 0,
        stored: 0,
        cancelled: 0,
      };
      batches.set(createdDate, batch);
    }

    batch.totalRecords++;
    switch (claimStatus) {
      case "SENT":
      case "ACCEPTED":
      case "ISSUED":
      case "PAID":
      case "CREDITED":
        batch.sent++;
        break;
      case "SEND_ERROR":
      case "ACCEPT_ERROR":
      case "UPDATE_ERROR":
      case "ERROR":
        batch.errors++;
        break;
      case "STORED":
        batch.stored++;
        break;
      case "CANCELLED":
        batch.cancelled++;
        break;
    }
  }

  return [...batches.values()]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);
}
