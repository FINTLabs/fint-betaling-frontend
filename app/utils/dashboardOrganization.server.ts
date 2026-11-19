import MeApi from "~/api/MeApi";
import { selectOrgCookie } from "~/utils/cookie";

export async function getDashboardOrganizationNumber(request: Request) {
  const cookieOrgNumber = await selectOrgCookie.parse(
    request.headers.get("Cookie"),
  );
  const { organisationUnits } = await MeApi.fetchMe();
  const selectedOrg =
    organisationUnits.find((org) => org.organisationNumber === cookieOrgNumber) ??
    organisationUnits[0];

  if (!selectedOrg) {
    throw new Response("Ingen organisasjon funnet", { status: 400 });
  }

  return selectedOrg.organisationNumber;
}
