import {
  type ActionFunctionArgs,
  data,
  isRouteErrorResponse,
  Links,
  type LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData, useLocation,
  useNavigate,
} from "react-router";

import type {Route} from "./+types/root";
import {Box, Page, Theme} from "@navikt/ds-react";
import {NovariFooter, NovariHeader} from "novari-frontend-components";
import {footerLinks, novariMenu} from "~/components/MenuConfig";
import themeHref from "./styles/novari-theme.css?url";
import akselHref from "@navikt/ds-css?url";
import MeApi from "~/api/MeApi";
import {OrganisationUnitSelect} from "~/components/OrganisationUnitSelect";
import {HeaderProperties} from "~/utils/headerProperties";
import {selectOrgCookie} from "~/utils/cookie";
import type {IOrganisationUnit, IUser} from "~/types/user";
import {CustomErrorLayout} from "~/components/CustomErrorLayout";
import CustomError from "~/components/CustomError";
import {useTrackAnalyticsPageViews} from "~/hooks/useTrackAnalyticsPageViews";
import AnalyticsApi from "~/api/AnalyticsApi";
import {useEffect} from "react";

// TODO: import { getContentSecurityPolicy } from "~/utils/csp";

//TODO: Clean up console.log lines
export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: akselHref, as: "style" }, // Aksel first
  { rel: "stylesheet", href: themeHref, as: "style" }, // novari-theme.css
];

// For client-side mocking for tests
let server: any;
if (import.meta.env.DEV && import.meta.env.VITE_MOCK_CYPRESS === 'true') {
  console.log('RUNNING WITH MOCK ENVIRONMENT');
  if (typeof window !== 'undefined') {
    console.log('RUNNING WITH MOCK ENVIRONMENT IN BROWSER');
    // Browser environment
    const { worker } = await import('../cypress/mocks/browser');
    await worker.start();
    // tell Cypress that MSW is ready
    (window as any).__mswReady = true;
  } else {
    console.log('RUNNING WITH MOCK ENVIRONMENT IN NODE');
    // Node.js environment (server-side)
    const { server: nodeServer } = await import('../cypress/mocks/server');
    server = nodeServer;
    server.listen();
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await MeApi.fetchMe();

  const cookieHeader = request.headers.get("Cookie");
  let cookieValue = await selectOrgCookie.parse(cookieHeader);

  let selectedOrganization = user.organisationUnits.find(
    (org) => org.organisationNumber === cookieValue,
  );
  if (!selectedOrganization) {
    selectedOrganization = user.organisationUnits[0];
    cookieValue = null;
  }

  HeaderProperties.setSchoolOrgId(selectedOrganization.organisationNumber);
  console.log("using school id: ", HeaderProperties.getSchoolOrgId());

  // TODO: const cspHeader = getContentSecurityPolicy();

  if (!cookieValue) {
    const newCookieHeader = await selectOrgCookie.serialize(
      selectedOrganization.organisationNumber,
    );
    return data(
      { user, selectedOrganization },
      {
        headers: {
          "Set-Cookie": newCookieHeader,
          // TODO: "Content-Security-Policy": cspHeader,
        },
      },
    );
  }

  return {
    user,
    selectedOrganization,
  };
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>FINT Elevfakturering</title>
      </head>
      <body>
      {children}
      <ScrollRestoration />
      <Scripts />
      </body>
      </html>
  );
}

export default function App() {
  const { user, selectedOrganization } = useLoaderData<{
    user: IUser;
    selectedOrganization: IOrganisationUnit;
  }>();

  useTrackAnalyticsPageViews(user?.organisation?.name || "unknown");

  console.log("selectedOrganization - root", selectedOrganization);
  const navigate = useNavigate();

  function onLogin(): void {
    throw new Error("Function not implemented.");
  }
  const theme: "light" | "dark" = "light";

  return (
      <Theme theme={theme} >
    <Page
      footer={
        <Box padding="space-2" as="footer" className={"novari-footer"}>
          <Page.Block gutters width="2xl">
            <NovariFooter links={footerLinks} />
          </Page.Block>
        </Box>
      }
    >
      <Box className={"novari-header"} as="nav" data-cy="novari-header" shadow="dialog">
        <NovariHeader
          isLoggedIn={true}
          menu={novariMenu}
          showLogoWithTitle={true}
          displayName={`${user.name || "Logged In"}${user.admin ? " [Admin]" : ""}`}
          onLogout={() =>
            (window.location.href =
              "https://idp.felleskomponent.no/nidp/app/logout")
          }
          onMenuClick={(action) => navigate(action)}
          appName={"FINT Elevfakturering"}
          onLogin={onLogin}
        >
          <OrganisationUnitSelect
            organisationUnits={user.organisationUnits}
            value={selectedOrganization}
          />
        </NovariHeader>
      </Box>

      <Box padding="space-6" paddingBlock="space-2" as="main">
        <Page.Block gutters width="2xl">
          <Outlet context={selectedOrganization} />
        </Page.Block>
      </Box>
    </Page>
      </Theme>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // let message = "Oops!";
  let details = "An unexpected error occurred.";
  // let stack: string | undefined;


  if (isRouteErrorResponse(error)) {
    // message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    // stack = error.stack;
  }

  //TODO: POC tracking
  const location = useLocation();
  useEffect(() => {
    void AnalyticsApi.trackError({
      path: location.pathname,
      message: details,
      statusCode: 500,
    });
  }, [details, location.pathname]);

  return (
    <CustomErrorLayout>
      <CustomError
        statusCode={500}
        errorData={details}
        statusTitle="Noe gikk galt"
      />
    </CustomErrorLayout>
    // <main className="pt-16 p-4 container mx-auto">
    //   <h1>{message}</h1>
    //   <p>{details}</p>
    //   {stack && (
    //     <pre className="w-full p-4 overflow-x-auto">
    //       <code>{stack}</code>
    //     </pre>
    //   )}
    // </main>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("actionType") as string;

  // const cspHeader = getContentSecurityPolicy();

  if (actionType === "UPDATE_SELECTED_ORGANIZATION") {
    const selectedOrganization = formData.get("selectedOrganization") as string;

    const newCookieHeader =
      await selectOrgCookie.serialize(selectedOrganization);
    return data(
      { revalidate: true },
      {
        headers: {
          "Set-Cookie": newCookieHeader,
          // "Content-Security-Policy": cspHeader,
        },
      },
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      // "Content-Security-Policy": cspHeader,
    },
  });
}
