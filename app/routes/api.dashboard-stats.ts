import type { LoaderFunctionArgs } from "react-router";
import ClaimApi from "~/api/ClaimApi";
import { getDashboardOrganizationNumber } from "~/utils/dashboardOrganization.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const organisationNumber = await getDashboardOrganizationNumber(request);
  const [stored, ...errors] = await Promise.all([
    ClaimApi.getCountByStatus(request, organisationNumber, "STORED"),
    ClaimApi.getCountByStatus(request, organisationNumber, "SEND_ERROR", "YEAR"),
    ClaimApi.getCountByStatus(request, organisationNumber, "ACCEPT_ERROR", "YEAR"),
    ClaimApi.getCountByStatus(request, organisationNumber, "UPDATE_ERROR", "YEAR"),
    ClaimApi.getCountByStatus(request, organisationNumber, "ERROR", "YEAR"),
  ]);

  if (!stored.success && errors.every((result) => !result.success)) {
    return { stats: null };
  }

  const pendingOrders = stored.success ? (stored.data ?? 0) : 0;
  const errorOrders = errors.reduce(
    (sum, result) => sum + (result.success ? (result.data ?? 0) : 0),
    0,
  );

  return {
    stats: { pendingOrders, errorOrders },
  };
}
