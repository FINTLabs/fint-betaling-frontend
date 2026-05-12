import {Box, HStack, Search, Spacer, VStack} from "@navikt/ds-react";
import React, {useEffect, useMemo, useState} from "react";
import type {IClaim} from "~/types/claim";
import {PageHeader} from "~/components/PageHeader";
import {ClaimHistoryFilters} from "~/components/claim-history/ClaimHistoryFilters";
import {ClaimHistoryActions} from "~/components/claim-history/ClaimHistoryActions";
import {ClaimHistoryTable} from "~/components/claim-history/ClaimHistoryTable";
import {type ActionFunction, type LoaderFunctionArgs, useFetcher, useLoaderData, useSearchParams,} from "react-router";
import {selectOrgCookie} from "~/utils/cookie";
import ClaimApi from "~/api/ClaimApi";
import MeApi from "~/api/MeApi";
import type {IUser} from "~/types/user";
import {SelectAndPaging} from "~/components/SelectAndPaging";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookieOrgNumber = await selectOrgCookie.parse(cookieHeader);
  const user = await MeApi.fetchMe();

  const organisationNumber =
    cookieOrgNumber ?? user.organisationUnits[0]?.organisationNumber;
  if (!organisationNumber) {
    return {
      claimHistory: [],
      user,
      periodSelection: "WEEK",
      schoolSelection: "",
      statusSelection: "",
    };
  }

  // Parse query string parameters from URL
  const url = new URL(request.url);
  const periodSelection = url.searchParams.get("periodSelection") || "WEEK";
  const schoolSelection =
    url.searchParams.get("schoolSelection") || organisationNumber;
  const statusSelection = url.searchParams.get("status") || "";

  const claimHistoryResponse = await ClaimApi.getClaims(
    organisationNumber,
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

  //eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [orderIdSearch, setOrderIdSearch] = useState("");

  const filteredClaimHistory = useMemo(() => {
    const query = orderIdSearch.trim();
    if (!query) {
      return claimHistory;
    }

    return claimHistory.filter((order) =>
      order.orderNumber.toString().includes(query),
    );
  }, [claimHistory, orderIdSearch]);

  useEffect(() => {
    setPage(1);
    setSelectedOrderIds([]);
  }, [orderIdSearch, claimHistory]);

  // SelectAndPaging
  const totalPages = Math.ceil(filteredClaimHistory.length / rowsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredClaimHistory.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredClaimHistory, page, rowsPerPage]);

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
    const formData = new FormData();
    formData.append("actionType", "SEND_TO_FACTORING");
    formData.append("selectedClaims", JSON.stringify(selectedOrderIds));
    fetcher.submit(formData, {
      method: "post",
    });
    setSelectedOrderIds([]);
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
        description="Filtrer på dato, status eller skole i feltene under. "
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
          claims={filteredClaimHistory}
        />
      </HStack>

      <Box padding={"space-16"}>
        <form role="search" onSubmit={(e) => e.preventDefault()}>
          <Search
            label="Søk på ordrenummer"
            variant="secondary"
            size="small"
            value={orderIdSearch}
            onChange={setOrderIdSearch}
            placeholder="Søk på ordrenummer"
            // htmlSize={20}
          />
        </form>
      </Box>

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
            : orderIdSearch.trim()
              ? "Ingen ordrer matcher ordrenummeret"
            : "Ingen ordrer tilgjengelig"
        }
      />

      {filteredClaimHistory.length > 0 && (
        <SelectAndPaging
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalOrders={filteredClaimHistory.length}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}
    </VStack>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType") as string;
  const inputSelectedClaimIds = formData.get("selectedClaims") as string;
  const selectedClaimIds = JSON.parse(inputSelectedClaimIds) as string[];
  const cookieHeader = request.headers.get("Cookie");
  const cookieOrgNumber = await selectOrgCookie.parse(cookieHeader);
  const user = await MeApi.fetchMe();
  const selectedOrg =
    cookieOrgNumber ?? user.organisationUnits[0]?.organisationNumber;

  if (!selectedOrg) {
    return {
      success: false,
      message: "Ingen organisasjon valgt",
      variant: "error",
    };
  }

  let response;

  switch (actionType) {
    case "DOWNLOAD_SELECTED":

        response = {
          success: true,
          message: `${selectedClaimIds.length} ordre slettet`,
          variant: "success",
        };

      break;
    case "SEND_TO_FACTORING":
      response = ClaimApi.sendClaimsToSystem(
          selectedOrg,
          inputSelectedClaimIds,
      );
      break;
    default:
      response = {
        success: false,
        message: `Ukjent handlingstype: '${actionType}'`,
        variant: "error",
      };
  }

  return response;
};