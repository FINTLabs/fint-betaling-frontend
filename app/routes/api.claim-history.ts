import { data, type LoaderFunctionArgs } from "react-router";
import ClaimApi from "~/api/ClaimApi";
import MeApi from "~/api/MeApi";
import type { IClaim } from "~/types/claim";
import { selectOrgCookie } from "~/utils/cookie";

export function headers() {
  return { "Cache-Control": "private, no-store" };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieOrgNumber = await selectOrgCookie.parse(request.headers.get("Cookie"));
  const { organisationUnits } = await MeApi.fetchMe(request);
  const organisationNumber = (
    organisationUnits.find((org) => org.organisationNumber === cookieOrgNumber) ??
    organisationUnits[0]
  )?.organisationNumber ?? "";
  const { searchParams } = new URL(request.url);
  searchParams.delete("_routes");
  const search = searchParams.toString();
  const periodSelection = searchParams.get("periodSelection") || "WEEK";
  const schoolSelection = searchParams.get("schoolSelection") || organisationNumber;
  const statusSelection = searchParams.get("status") || "";

  const orders = organisationNumber
    ? await ClaimApi.getClaims(
        request,
        organisationNumber,
        statusSelection,
        periodSelection,
        schoolSelection,
      )
    : { success: true, data: [], status: 204 };

  let claimHistory: IClaim[] | null = null;
  if (orders.success && Array.isArray(orders.data)) {
    claimHistory = orders.data;
  } else if (orders.success && orders.status === 204) {
    claimHistory = [];
  }

  return data(
    {
      organisationNumber,
      search,
      claimHistory,
    },
    { headers: headers() },
  );
}
