import type { Route } from "./+types/home";
import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  LinkCard,
  Table,
  VStack,
} from "@navikt/ds-react";
import {
  ClockIcon,
  ExclamationmarkTriangleIcon,
  FileIcon,
} from "@navikt/aksel-icons";
import { PageHeader } from "~/components/PageHeader";
import { useNavigate, useOutletContext, useLoaderData } from "react-router";
import type { IOrder } from "~/types/order";
import type { IOrganisationUnit } from "~/types/user";
import { formatCurrency, formatDate } from "~/utils/variousFormats";
import { selectOrgCookie } from "~/utils/cookie";
import OrderApi from "~/api/OrderApi";
import type { LoaderFunctionArgs } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FINT Betaling - Dashboard" },
    { name: "description", content: "Dashboard for FINT Betaling" },
  ];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const selectedOrg = await selectOrgCookie.parse(cookieHeader);

  // Fetch counts for different statuses
  // TODO: set this to the last 2 weeks
  const [
    storedCount,
    sendErrorCount,
    acceptErrorCount,
    updateErrorCount,
    errorCount,
    cancelledCount,
  ] = await Promise.all([
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "STORED", "14"),
    OrderApi.getCountByStatus(
      selectedOrg.organisationNumber,
      "SEND_ERROR",
      "14",
    ),
    OrderApi.getCountByStatus(
      selectedOrg.organisationNumber,
      "ACCEPT_ERROR",
      "14",
    ),
    OrderApi.getCountByStatus(
      selectedOrg.organisationNumber,
      "UPDATE_ERROR",
      "14",
    ),
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "ERROR", "14"),
    OrderApi.getCountByStatus(
      selectedOrg.organisationNumber,
      "CANCELLED",
      "14",
    ),
  ]);

  const pendingOrders = storedCount.success ? storedCount.data || 0 : 0;
  const errorOrders =
    (sendErrorCount.success ? sendErrorCount.data || 0 : 0) +
    (acceptErrorCount.success ? acceptErrorCount.data || 0 : 0) +
    (updateErrorCount.success ? updateErrorCount.data || 0 : 0) +
    (errorCount.success ? errorCount.data || 0 : 0) +
    (cancelledCount.success ? cancelledCount.data || 0 : 0);

  // For total orders, you might want to fetch all statuses or use a different endpoint
  // For now, we'll sum the counts we have (you may need to add more statuses)
  const totalOrders = pendingOrders + errorOrders;

  return {
    pendingOrders,
    errorOrders,
    totalOrders,
  };
};

//TODO: add toaster from novari components

// Mock data for dashboard stats
const mockOrders: IOrder[] = [
  {
    orgId: "pwf.no",
    orderNumber: 10236,
    invoiceNumbersCommaSeperated: null,
    createdDate: "2026-01-16T10:11:40.611486",
    lastModifiedDate: "2026-01-16T10:11:40.611486",
    invoiceDate: null,
    paymentDueDate: null,
    amountDue: null,
    originalAmountDue: 89000,
    requestedNumberOfDaysToPaymentDeadline: null,
    customerId: "1tjuxj",
    customerName: "Hofseth, Gustav",
    createdByEmployeeNumber: "100006",
    organisationUnit: {
      organisationNumber: "970123458",
      name: "Sundet VGS",
    },
    principalCode: "12",
    principalUri:
      "https://play-with-fint.felleskomponent.no/okonomi/faktura/fakturautsteder/systemid/12",
    invoiceUri: null,
    orderItems: [],
    claimStatus: "STORED",
    statusMessage: "Ikke oversendt",
    timestamp: 1768554700653,
    invoiceNumbers: [],
  },
  {
    orgId: "pwf.no",
    orderNumber: 10235,
    invoiceNumbersCommaSeperated: null,
    createdDate: "2026-01-16T10:11:40.611486",
    lastModifiedDate: "2026-01-16T10:11:40.611486",
    invoiceDate: null,
    paymentDueDate: null,
    amountDue: null,
    originalAmountDue: 89000,
    requestedNumberOfDaysToPaymentDeadline: null,
    customerId: "2z87km",
    customerName: "Hansen, Leona",
    createdByEmployeeNumber: "100006",
    organisationUnit: {
      organisationNumber: "970123458",
      name: "Sundet VGS",
    },
    principalCode: "12",
    principalUri:
      "https://play-with-fint.felleskomponent.no/okonomi/faktura/fakturautsteder/systemid/12",
    invoiceUri: null,
    orderItems: [],
    claimStatus: "STORED",
    statusMessage: "Ikke oversendt",
    timestamp: 1768554700639,
    invoiceNumbers: [],
  },
  {
    orgId: "pwf.no",
    orderNumber: 10234,
    invoiceNumbersCommaSeperated: null,
    createdDate: "2026-01-16T10:11:40.611486",
    lastModifiedDate: "2026-01-16T10:11:40.611486",
    invoiceDate: null,
    paymentDueDate: null,
    amountDue: null,
    originalAmountDue: 89000,
    requestedNumberOfDaysToPaymentDeadline: null,
    customerId: "2bj3kw",
    customerName: "Støa, Rose",
    createdByEmployeeNumber: "100006",
    organisationUnit: {
      organisationNumber: "970123458",
      name: "Sundet VGS",
    },
    principalCode: "12",
    principalUri:
      "https://play-with-fint.felleskomponent.no/okonomi/faktura/fakturautsteder/systemid/12",
    invoiceUri: null,
    orderItems: [],
    claimStatus: "STORED",
    statusMessage: "Ikke oversendt",
    timestamp: 1768554700622,
    invoiceNumbers: [],
  },
  {
    orgId: "pwf.no",
    orderNumber: 10233,
    invoiceNumbersCommaSeperated: null,
    createdDate: "2026-01-16T10:08:23.773447",
    lastModifiedDate: "2026-01-16T10:08:23.773447",
    invoiceDate: null,
    paymentDueDate: null,
    amountDue: null,
    originalAmountDue: 1279200,
    requestedNumberOfDaysToPaymentDeadline: null,
    customerId: "2z87km",
    customerName: "Hansen, Leona",
    createdByEmployeeNumber: "100006",
    organisationUnit: {
      organisationNumber: "970123458",
      name: "Sundet VGS",
    },
    principalCode: "12",
    principalUri:
      "https://play-with-fint.felleskomponent.no/okonomi/faktura/fakturautsteder/systemid/12",
    invoiceUri: null,
    orderItems: [],
    claimStatus: "STORED",
    statusMessage: "Ikke oversendt",
    timestamp: 1768554503782,
    invoiceNumbers: [],
  },
  {
    orgId: "pwf.no",
    orderNumber: 10232,
    invoiceNumbersCommaSeperated: null,
    createdDate: "2026-01-16T09:48:16.998705",
    lastModifiedDate: "2026-01-16T09:48:16.998705",
    invoiceDate: null,
    paymentDueDate: null,
    amountDue: null,
    originalAmountDue: 1664100,
    requestedNumberOfDaysToPaymentDeadline: null,
    customerId: "1tjuxj",
    customerName: "Hofseth, Gustav",
    createdByEmployeeNumber: "100006",
    organisationUnit: {
      organisationNumber: "970123458",
      name: "Sundet VGS",
    },
    principalCode: "12",
    principalUri:
      "https://play-with-fint.felleskomponent.no/okonomi/faktura/fakturautsteder/systemid/12",
    invoiceUri: null,
    orderItems: [],
    claimStatus: "STORED",
    statusMessage: "Ikke oversendt",
    timestamp: 1768553297099,
    invoiceNumbers: [],
  },
  {
    orgId: "pwf.no",
    orderNumber: 10230,
    invoiceNumbersCommaSeperated: null,
    createdDate: "2026-01-15T14:20:10.123456",
    lastModifiedDate: "2026-01-15T14:25:30.654321",
    invoiceDate: null,
    paymentDueDate: null,
    amountDue: null,
    originalAmountDue: 50000,
    requestedNumberOfDaysToPaymentDeadline: null,
    customerId: "3abc123",
    customerName: "Test, Error",
    createdByEmployeeNumber: "100006",
    organisationUnit: {
      organisationNumber: "970123458",
      name: "Sundet VGS",
    },
    principalCode: "12",
    principalUri:
      "https://play-with-fint.felleskomponent.no/okonomi/faktura/fakturautsteder/systemid/12",
    invoiceUri: null,
    orderItems: [],
    claimStatus: "CANCELLED",
    statusMessage: "Kansellert",
    timestamp: 1768467630123,
    invoiceNumbers: [],
  },
  {
    orgId: "pwf.no",
    orderNumber: 10229,
    invoiceNumbersCommaSeperated: null,
    createdDate: "2026-01-14T11:15:20.987654",
    lastModifiedDate: "2026-01-14T11:20:45.321098",
    invoiceDate: null,
    paymentDueDate: null,
    amountDue: null,
    originalAmountDue: 75000,
    requestedNumberOfDaysToPaymentDeadline: null,
    customerId: "4def456",
    customerName: "Another, Error",
    createdByEmployeeNumber: "100006",
    organisationUnit: {
      organisationNumber: "970123458",
      name: "Sundet VGS",
    },
    principalCode: "12",
    principalUri:
      "https://play-with-fint.felleskomponent.no/okonomi/faktura/fakturautsteder/systemid/12",
    invoiceUri: null,
    orderItems: [],
    claimStatus: "CANCELLED",
    statusMessage: "Kansellert",
    timestamp: 1768380920987,
    invoiceNumbers: [],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const selectedOrg = useOutletContext<IOrganisationUnit>();
  const { pendingOrders, errorOrders, totalOrders } = useLoaderData<{
    pendingOrders: number;
    errorOrders: number;
    totalOrders: number;
  }>();

  // Use mock data for recent orders table (you may want to fetch this separately)
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <VStack gap="6">
      <PageHeader
        title={`Dashboard - ${selectedOrg.name}`}
        description="Oversikt over ordrer og aktivitet"
      />

      {/* Stats Cards */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <li style={{ flex: "1 1 250px", minWidth: "250px" }}>
          <LinkCard>
            <Box
              asChild
              borderRadius="12"
              padding="space-8"
              background="surface-default"
            >
              <LinkCard.Icon>
                <FileIcon title="Dokument" fontSize="1.5rem" />
              </LinkCard.Icon>
            </Box>
            <LinkCard.Title as="span">
              <LinkCard.Anchor href="/order-history">
                Totalt antall ordrer
              </LinkCard.Anchor>
            </LinkCard.Title>
            <LinkCard.Description>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#222",
                  display: "block",
                  marginTop: "0.5rem",
                }}
              >
                {totalOrders}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#666",
                  display: "block",
                  marginTop: "0.25rem",
                }}
              >
                Total antall ordrer siste 14 dager
              </span>
            </LinkCard.Description>
          </LinkCard>
        </li>
        <li style={{ flex: "1 1 250px", minWidth: "250px" }}>
          <LinkCard>
            <Box
              asChild
              borderRadius="12"
              padding="space-8"
              background="surface-default"
            >
              <LinkCard.Icon>
                <ClockIcon title="Klokke" fontSize="1.5rem" />
              </LinkCard.Icon>
            </Box>
            <LinkCard.Title as="span">
              <LinkCard.Anchor href="/orders">Ventende ordrer</LinkCard.Anchor>
            </LinkCard.Title>
            <LinkCard.Description>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#222",
                  display: "block",
                  marginTop: "0.5rem",
                }}
              >
                {pendingOrders}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#666",
                  display: "block",
                  marginTop: "0.25rem",
                }}
              >
                Ikke sendt til fakturering
              </span>
            </LinkCard.Description>
          </LinkCard>
        </li>
        <li style={{ flex: "1 1 250px", minWidth: "250px" }}>
          <LinkCard>
            <Box
              asChild
              borderRadius="12"
              padding="space-8"
              background="surface-default"
            >
              <LinkCard.Icon>
                <ExclamationmarkTriangleIcon
                  title="Advarsel"
                  fontSize="1.5rem"
                />
              </LinkCard.Icon>
            </Box>
            <LinkCard.Title as="span">
              <LinkCard.Anchor href="/order-history">
                Antall feil
              </LinkCard.Anchor>
            </LinkCard.Title>
            <LinkCard.Description>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#222",
                  display: "block",
                  marginTop: "0.5rem",
                }}
              >
                {errorOrders}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#666",
                  display: "block",
                  marginTop: "0.25rem",
                }}
              >
                Kansellerte eller feilede ordrer
              </span>
            </LinkCard.Description>
          </LinkCard>
        </li>
      </ul>

      {/* Quick Actions */}
      <Box
        padding="6"
        background="surface-default"
        borderRadius="large"
        borderWidth="1"
        borderColor="border-subtle"
      >
        <VStack gap="4" align="start">
          <Heading size="medium" level="3" spacing>
            Hurtighandlinger
          </Heading>
          <HStack gap="4" wrap>
            <Button variant="primary" onClick={() => navigate("/payment")}>
              Opprett ny bestilling
            </Button>
            <Button variant="secondary" onClick={() => navigate("/orders")}>
              Se ventende ordrer
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/order-history")}
            >
              Se ordre historikk
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Recent OrderPending */}
      <Box
        padding="6"
        background="surface-default"
        borderRadius="large"
        borderWidth="1"
        borderColor="border-subtle"
      >
        <VStack gap="4" align="start">
          <HStack gap="4" justify="space-between" style={{ width: "100%" }}>
            <Heading size="medium" level="3" spacing>
              Siste ordrer
            </Heading>
            <Link href="/order-history" as="button">
              Se alle
            </Link>
          </HStack>

          {recentOrders.length === 0 ? (
            <Box paddingBlock="4">
              <p
                style={{
                  margin: 0,
                  color: "var(--a-text-subtle)",
                  fontSize: "0.875rem",
                }}
              >
                Ingen ordrer funnet
              </p>
            </Box>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Ordrenummer</Table.HeaderCell>
                  <Table.HeaderCell>Mottaker</Table.HeaderCell>
                  <Table.HeaderCell>Skole</Table.HeaderCell>
                  <Table.HeaderCell align="right">Beløp</Table.HeaderCell>
                  <Table.HeaderCell>Opprettet</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {recentOrders.map((order) => {
                  const amountToDisplay =
                    order.amountDue ?? order.originalAmountDue;
                  return (
                    <Table.Row key={order.orderNumber}>
                      <Table.DataCell>
                        <strong>{order.orderNumber}</strong>
                      </Table.DataCell>
                      <Table.DataCell>{order.customerName}</Table.DataCell>
                      <Table.DataCell>
                        {order.organisationUnit.name}
                      </Table.DataCell>
                      <Table.DataCell align="right">
                        <strong>{formatCurrency(amountToDisplay)}</strong>
                      </Table.DataCell>
                      <Table.DataCell>
                        {formatDate(order.createdDate)}
                      </Table.DataCell>
                      <Table.DataCell>{order.statusMessage}</Table.DataCell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}
