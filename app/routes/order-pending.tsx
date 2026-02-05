import {
  Box,
  VStack,
  Table,
  Checkbox,
  TextField,
  Button,
  HStack,
} from "@navikt/ds-react";
import { useState, useMemo } from "react";
import type { IOrder } from "~/types/order";
import { PageHeader } from "~/components/PageHeader";
import { formatCurrency } from "~/utils/variousFormats";
import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import { selectOrgCookie } from "~/utils/cookie";
import MeApi from "~/api/MeApi";
import OrderApi from "~/api/OrderApi";
import type { IUser } from "~/types/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const selectedOrg = await selectOrgCookie.parse(cookieHeader);
  const user = await MeApi.fetchMe();

  const [historyResponse] = await Promise.all([
    OrderApi.getOrders(selectedOrg.organisationNumber, "STORED"),
  ]);

  console.log("historyResponse: ", historyResponse?.data?.length);
  if (historyResponse.success && historyResponse.data) {
    return {
      orderHistory: historyResponse.data,
      user,
    };
  }

  return {
    orderHistory: [],
    user,
  };
};

export default function OrderPending() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const { orderHistory, user } = useLoaderData<{
    orderHistory: IOrder[];
    user: IUser;
  }>();

  const filteredOrders = useMemo(() => {
    // Filter by claimStatus "STORED"
    let filtered = orderHistory.filter(
      (order) => order.claimStatus === "STORED",
    );

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) =>
        order.orderNumber.toString().toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchQuery]);

  const allSelected =
    filteredOrders.length > 0 &&
    selectedOrderIds.length === filteredOrders.length;
  const someSelected =
    selectedOrderIds.length > 0 &&
    selectedOrderIds.length < filteredOrders.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(
        filteredOrders.map((order) => order.orderNumber.toString()),
      );
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrderIds((prev) => [...prev, orderId]);
    } else {
      setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleSendToFakturering = () => {
    console.log("Sending orders to fakturering:", selectedOrderIds);
    // Handle send to fakturering logic here
    setSelectedOrderIds([]);
  };

  const handleDeleteSelected = () => {
    console.log("Deleting orders:", selectedOrderIds);
    // Handle delete logic here
    setSelectedOrderIds([]);
  };

  return (
    <VStack gap="6">
      <PageHeader
        title="Ordre som ikke er sendt til fakturering"
        description={
          "Søk på ordrenummer i feltet under. Oversikten viser kun ordrer du har opprettet"
        }
      />

      {/* Search and Send Button */}
      <HStack gap="4" wrap align="end">
        <Box style={{ flex: 1, minWidth: "250px" }}>
          <TextField
            label="Søk etter ordrenummer"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Søk etter ordrenummer"
          />
        </Box>
        <Button
          variant="secondary"
          size="small"
          onClick={handleSendToFakturering}
          disabled={selectedOrderIds.length === 0}
        >
          SEND ORDRE TIL FAKTURERING
        </Button>
      </HStack>

      {/* OrderPending Table */}
      <Box
        padding="6"
        background="surface-default"
        borderRadius="large"
        borderWidth="1"
        borderColor="border-subtle"
      >
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ width: "60px" }}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  hideLabel
                >
                  Velg alle
                </Checkbox>
              </Table.HeaderCell>
              <Table.HeaderCell>Ordrenummer</Table.HeaderCell>
              <Table.HeaderCell>Mottakernavn</Table.HeaderCell>
              <Table.HeaderCell>Skole</Table.HeaderCell>
              <Table.HeaderCell align="right">Restbeløp</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredOrders.length === 0 ? (
              <Table.Row>
                <Table.DataCell colSpan={5} style={{ textAlign: "center" }}>
                  <p
                    style={{
                      color: "var(--a-text-subtle)",
                      margin: 0,
                      fontSize: "0.875rem",
                    }}
                  >
                    {searchQuery
                      ? "Ingen resultater funnet for søket ditt"
                      : "Ingen ordrer tilgjengelig"}
                  </p>
                </Table.DataCell>
              </Table.Row>
            ) : (
              filteredOrders.map((order) => {
                const orderId = order.orderNumber.toString();
                const isSelected = selectedOrderIds.includes(orderId);
                const amountToDisplay =
                  order.amountDue ?? order.originalAmountDue;
                return (
                  <Table.Row
                    key={order.orderNumber}
                    selected={isSelected}
                    onRowClick={() => handleSelectOrder(orderId, !isSelected)}
                  >
                    <Table.DataCell>
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) =>
                          handleSelectOrder(orderId, e.target.checked)
                        }
                        hideLabel
                        //onClick={(e) => e.stopPropagation()}
                      >
                        Velg {order.orderNumber}
                      </Checkbox>
                    </Table.DataCell>
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
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table>
      </Box>

      {/* Delete Selected Button */}
      <Box style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="secondary"
          size="small"
          onClick={handleDeleteSelected}
          disabled={selectedOrderIds.length === 0}
        >
          SLETT VALGTE
        </Button>
      </Box>
    </VStack>
  );
}
