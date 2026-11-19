import { data, type LoaderFunctionArgs } from "react-router";
import ClaimApi from "~/api/ClaimApi";
import MeApi from "~/api/MeApi";
import { selectOrgCookie } from "~/utils/cookie";

export function headers() {
  return { "Cache-Control": "private, no-store" };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieOrgNumber = await selectOrgCookie.parse(request.headers.get("Cookie"));
  const { organisationUnits } = await MeApi.fetchMe();
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
        organisationNumber,
        statusSelection,
        periodSelection,
        schoolSelection,
      )
    : { success: true, data: [] };

  return data(
    {
      organisationNumber,
      search,
      claimHistory: orders.success ? (orders.data ?? []) : null,
    },
    { headers: headers() },
  );
}
