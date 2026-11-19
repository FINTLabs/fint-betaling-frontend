import type { LoaderFunctionArgs } from "react-router";
import ClaimApi from "~/api/ClaimApi";
import { getDashboardOrganizationNumber } from "~/utils/dashboardOrganization.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const organisationNumber = await getDashboardOrganizationNumber(request);
  const [stored, ...errors] = await Promise.all([
    ClaimApi.getCountByStatus(organisationNumber, "STORED"),
    ClaimApi.getCountByStatus(organisationNumber, "SEND_ERROR", "YEAR"),
    ClaimApi.getCountByStatus(organisationNumber, "ACCEPT_ERROR", "YEAR"),
    ClaimApi.getCountByStatus(organisationNumber, "UPDATE_ERROR", "YEAR"),
    ClaimApi.getCountByStatus(organisationNumber, "ERROR", "YEAR"),
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
