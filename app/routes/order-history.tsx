import { VStack, HStack, Spacer } from "@navikt/ds-react";
import React, { useState, useMemo } from "react";
import type { IOrder } from "~/types/order";
import { PageHeader } from "~/components/PageHeader";
import { OrderHistoryFilters } from "~/components/order-history/OrderHistoryFilters";
import { OrderHistoryActions } from "~/components/order-history/OrderHistoryActions";
import { OrderHistoryTable } from "~/components/order-history/OrderHistoryTable";
import { OrderHistoryPagination } from "~/components/order-history/OrderHistoryPagination";
import {
  type LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
  useRevalidator,
} from "react-router";
import { selectOrgCookie } from "~/utils/cookie";
import OrderApi from "~/api/OrderApi";
import MeApi from "~/api/MeApi";
import type { IUser } from "~/types/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const selectedOrg = await selectOrgCookie.parse(cookieHeader);
  const user = await MeApi.fetchMe();

  // Get URL search parameters
  const url = new URL(request.url);
  const periodSelection = url.searchParams.get("periodSelection") || "ALL";
  const schoolSelection = url.searchParams.get("schoolSelection") || undefined;
  const status = url.searchParams.get("status") || undefined;

  console.log(
    "selected org id in order history: ",
    selectedOrg.organisationNumber,
  );
  console.log(
    "URL params - periodSelection:",
    periodSelection,
    "schoolSelection:",
    schoolSelection,
    "status:",
    status,
  );

  // Fetch orders and status counts in parallel
  const [historyResponse, ...statusCounts] = await Promise.all([
    OrderApi.getOrders(
      selectedOrg.organisationNumber,
      status,
      periodSelection,
      schoolSelection,
    ),
    // Fetch counts for all statuses to display in filter dropdown
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "STORED", periodSelection === "ALL" ? undefined : periodSelection, schoolSelection),
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "SENT", periodSelection === "ALL" ? undefined : periodSelection, schoolSelection),
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "ACCEPTED", periodSelection === "ALL" ? undefined : periodSelection, schoolSelection),
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "ISSUED", periodSelection === "ALL" ? undefined : periodSelection, schoolSelection),
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "PAID", periodSelection === "ALL" ? undefined : periodSelection, schoolSelection),
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "CREDITED", periodSelection === "ALL" ? undefined : periodSelection, schoolSelection),
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "UPDATE_ERROR", periodSelection === "ALL" ? undefined : periodSelection, schoolSelection),
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "ACCEPT_ERROR", periodSelection === "ALL" ? undefined : periodSelection, schoolSelection),
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "SEND_ERROR", periodSelection === "ALL" ? undefined : periodSelection, schoolSelection),
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "ERROR", periodSelection === "ALL" ? undefined : periodSelection, schoolSelection),
    OrderApi.getCountByStatus(selectedOrg.organisationNumber, "CANCELLED", periodSelection === "ALL" ? undefined : periodSelection, schoolSelection),
  ]);

  // Extract counts from responses
  const statusCountMap: Record<string, number> = {
    STORED: statusCounts[0]?.success ? statusCounts[0].data || 0 : 0,
    SENT: statusCounts[1]?.success ? statusCounts[1].data || 0 : 0,
    ACCEPTED: statusCounts[2]?.success ? statusCounts[2].data || 0 : 0,
    ISSUED: statusCounts[3]?.success ? statusCounts[3].data || 0 : 0,
    PAID: statusCounts[4]?.success ? statusCounts[4].data || 0 : 0,
    CREDITED: statusCounts[5]?.success ? statusCounts[5].data || 0 : 0,
    UPDATE_ERROR: statusCounts[6]?.success ? statusCounts[6].data || 0 : 0,
    ACCEPT_ERROR: statusCounts[7]?.success ? statusCounts[7].data || 0 : 0,
    SEND_ERROR: statusCounts[8]?.success ? statusCounts[8].data || 0 : 0,
    ERROR: statusCounts[9]?.success ? statusCounts[9].data || 0 : 0,
    CANCELLED: statusCounts[10]?.success ? statusCounts[10].data || 0 : 0,
  };

  //TODO: handle this with the novari toaster
  console.log("historyResponse: ", historyResponse?.data?.length);
  if (historyResponse.success && historyResponse.data) {
    return {
      orderHistory: historyResponse.data,
      user,
      statusCounts: statusCountMap,
    };
  }

  return {
    orderHistory: [],
    user,
    statusCounts: statusCountMap,
  };
};

export default function OrderHistory() {
  const { orderHistory, user, statusCounts } = useLoaderData<{
    orderHistory: IOrder[];
    user: IUser;
    statusCounts: Record<string, number>;
  }>();

  const [searchParams, setSearchParams] = useSearchParams();
  const revalidate = useRevalidator();

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  // Get current URL params
  const periodSelection = searchParams.get("periodSelection") || "ALL";
  const schoolSelection = searchParams.get("schoolSelection") || "";
  const statusParam = searchParams.get("status");
  const statusFilter = statusParam ? statusParam.toUpperCase() : "all";

  // Update URL params when filters change
  const updateSearchParams = (
    updates: Record<string, string | null>,
    resetPage = true,
  ) => {
    const newParams = new URLSearchParams(searchParams);

    //TODO: check this is correct
    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === null ||
        value === "" ||
        value === "all" ||
        value === "ALL"
      ) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    if (resetPage) {
      newParams.delete("page");
      setPage(1);
    }

    setSearchParams(newParams, { replace: true });
    // Trigger revalidation to reload data
    revalidate.revalidate();
  };

  // Use orders directly from loader (backend handles filtering)
  //TODO: why rename this ?
  const filteredOrders = orderHistory;

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredOrders, page, rowsPerPage]);

  // Get selectable orders (only SEND_ERROR, STORED, ACCEPT_ERROR)
  const selectableOrders = useMemo(() => {
    return paginatedOrders.filter(
      (order) =>
        order.claimStatus === "SEND_ERROR" ||
        order.claimStatus === "STORED" ||
        order.claimStatus === "ACCEPT_ERROR",
    );
  }, [paginatedOrders]);

  const allSelected =
    selectableOrders.length > 0 &&
    selectedOrderIds.length === selectableOrders.length;
  const someSelected =
    selectedOrderIds.length > 0 &&
    selectedOrderIds.length < selectableOrders.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(
        selectableOrders.map((order) => order.orderNumber.toString()),
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

  const handleUpdate = () => {
    console.log("Updating orders:", selectedOrderIds);
    // Handle update logic here
  };

  const handleResend = () => {
    console.log("Resending orders:", selectedOrderIds);
    // Handle resend logic here
  };

  const handleExport = () => {
    console.log("Exporting orders:", selectedOrderIds);
    // Handle export logic here
  };

  const handleDateFilterChange = (value: string) => {
    updateSearchParams({ periodSelection: value === "ALL" ? null : value });
  };

  const handleStatusFilterChange = (value: string) => {
    updateSearchParams({ status: value === "all" ? null : value });
  };

  const handleSchoolSelectionChange = (value: string) => {
    updateSearchParams({ schoolSelection: value === "" ? null : value });
  };

  return (
    <VStack gap="6">
      <PageHeader
        title="Ordre historikk"
        description="Filtrer på dato, status eller skole i feltene under. Du kan også sortere ved å klikke på overskriftene."
      />

      {/* Filters, Search and Actions */}
      <HStack gap="4" wrap align="end">
        <OrderHistoryFilters
          dateFilter={periodSelection}
          statusFilter={statusFilter}
          schoolSelection={schoolSelection}
          organisationUnits={user.organisationUnits}
          statusCounts={statusCounts}
          onDateFilterChange={handleDateFilterChange}
          onStatusFilterChange={handleStatusFilterChange}
          onSchoolSelectionChange={handleSchoolSelectionChange}
        />
        <Spacer />
        <OrderHistoryActions
          selectedCount={selectedOrderIds.length}
          onUpdate={handleUpdate}
          onResend={handleResend}
          onExport={handleExport}
        />
      </HStack>

      {/* Order History Table */}
      <OrderHistoryTable
        orders={paginatedOrders}
        selectedOrderIds={selectedOrderIds}
        onSelectAll={handleSelectAll}
        onSelectOrder={handleSelectOrder}
        allSelected={allSelected}
        someSelected={someSelected}
        emptyMessage={
          orderHistory.length === 0
            ? "Ingen ordrer funnet"
            : "Ingen ordrer tilgjengelig"
        }
      />

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <OrderHistoryPagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalOrders={filteredOrders.length}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}
    </VStack>
  );
}
