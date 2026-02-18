import { HStack, Spacer, VStack } from "@navikt/ds-react";
import React, { useMemo, useState } from "react";
import type { IClaim } from "~/types/claim";
import { PageHeader } from "~/components/PageHeader";
import { ClaimHistoryFilters } from "~/components/claim-history/ClaimHistoryFilters";
import { ClaimHistoryActions } from "~/components/claim-history/ClaimHistoryActions";
import { ClaimHistoryTable } from "~/components/claim-history/ClaimHistoryTable";
import { ClaimHistoryPagination } from "~/components/claim-history/ClaimHistoryPagination";
import {
  type LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from "react-router";
import { selectOrgCookie } from "~/utils/cookie";
import ClaimApi from "~/api/ClaimApi";
import MeApi from "~/api/MeApi";
import type { IUser } from "~/types/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const selectedOrg = await selectOrgCookie.parse(cookieHeader);
  const user = await MeApi.fetchMe();

  // Parse query string parameters from URL
  const url = new URL(request.url);
  const periodSelection = url.searchParams.get("periodSelection") || "WEEK";
  const schoolSelection =
    url.searchParams.get("schoolSelection") || selectedOrg.organisationNumber;
  const statusSelection = url.searchParams.get("status") || "";

  const claimHistoryResponse = await ClaimApi.getClaims(
    selectedOrg.organisationNumber,
    statusSelection,
    periodSelection,
    schoolSelection,
  );

  const claimHistory = claimHistoryResponse.success
    ? claimHistoryResponse.data || []
    : [];

  return {
    claimHistory,
    user,
    periodSelection,
    schoolSelection,
    statusSelection,
  };
};

export default function ClaimHistory() {
  const {
    claimHistory,
    user,
    periodSelection,
    schoolSelection,
    statusSelection,
  } = useLoaderData<{
    claimHistory: IClaim[];
    user: IUser;
    periodSelection: string;
    schoolSelection: string;
    statusSelection: string;
  }>();

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  // Pagination
  const totalPages = Math.ceil(claimHistory.length / rowsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return claimHistory.slice(startIndex, startIndex + rowsPerPage);
  }, [claimHistory, page, rowsPerPage]);

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

  const handleResend = () => {
    console.log("Resending orders:", selectedOrderIds);
    // Handle resend logic here
  };

  const handleExport = () => {
    console.log("Exporting orders:", selectedOrderIds);
    // Handle export logic here
  };

  const handleDateFilterChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set("periodSelection", value);
      return prev;
    });
  };

  const handleStatusFilterChange = (value: string) => {
    if (value === "all") {
      setSearchParams((prev) => {
        prev.delete("status");
        return prev;
      });
      console.log("searchParams: ", searchParams);
      return;
    }
    setSearchParams((prev) => {
      prev.set("status", value);
      return prev;
    });
  };

  const handleSchoolSelectionChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set("schoolSelection", value);
      return prev;
    });
  };

  return (
    <VStack gap="space-6">
      <PageHeader
        title="Ordre historikk"
        description="Filtrer på dato, status eller skole i feltene under. Du kan også sortere ved å klikke på overskriftene."
      />

      <HStack gap="space-4" wrap align="end">
        <ClaimHistoryFilters
          dateFilter={periodSelection}
          statusFilter={statusSelection}
          schoolSelection={schoolSelection}
          organisationUnits={user.organisationUnits}
          onDateFilterChange={handleDateFilterChange}
          onStatusFilterChange={handleStatusFilterChange}
          onSchoolSelectionChange={handleSchoolSelectionChange}
        />
        <Spacer />
        <ClaimHistoryActions
          selectedCount={selectedOrderIds.length}
          onResend={handleResend}
          onExport={handleExport}
        />
      </HStack>

      <ClaimHistoryTable
        claims={paginatedOrders}
        selectedClaimIds={selectedOrderIds}
        onSelectAll={handleSelectAll}
        onSelectClaim={handleSelectOrder}
        allSelected={allSelected}
        someSelected={someSelected}
        emptyMessage={
          claimHistory.length === 0
            ? "Ingen ordrer funnet"
            : "Ingen ordrer tilgjengelig"
        }
      />

      {claimHistory.length > 0 && (
        <ClaimHistoryPagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalOrders={claimHistory.length}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}
    </VStack>
  );
}
