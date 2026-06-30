import { Box, Button, HStack, TextField, VStack } from "@navikt/ds-react";
import React, { useMemo, useState } from "react";
import type { IClaim } from "~/types/claim";
import { PageHeader } from "~/components/PageHeader";
import {
  type ActionFunction,
  type LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from "react-router";
import { selectOrgCookie } from "~/utils/cookie";
import MeApi from "~/api/MeApi";
import ClaimApi from "~/api/ClaimApi";
import { ClaimHistoryTable } from "~/components/claim-history/ClaimHistoryTable";
import {
  NovariConfirmAction,
 NovariToaster,
  useAlerts,
} from "novari-frontend-components";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookieOrgNumber = await selectOrgCookie.parse(cookieHeader);
  const user = await MeApi.fetchMe();

  const organisationNumber =
    cookieOrgNumber ?? user.organisationUnits[0]?.organisationNumber;
  if (!organisationNumber) {
    return { pendingClaims: [], user };
  }

  const [pendingResponse] = await Promise.all([
    ClaimApi.getClaims(organisationNumber, "STORED", undefined, undefined),
  ]);

  if (pendingResponse.success && pendingResponse.data) {
    return {
      pendingClaims: pendingResponse.data,
    };
  }

  return {
    pendingClaims: [],
    user,
  };
};

export default function ClaimPending() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClaimIds, setSelectedClaimIds] = useState<string[]>([]);
  const fetcher = useFetcher();
  const actionData = fetcher.data;
  const { alertState } = useAlerts<IClaim>([], actionData, fetcher.state);

  const { pendingClaims } = useLoaderData<{
    pendingClaims: IClaim[];
  }>();

  const filteredClaims = useMemo(() => {
    let filtered = pendingClaims;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((c) =>
        c.orderNumber.toString().toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [pendingClaims, searchQuery]);

  const allSelected =
    filteredClaims.length > 0 &&
    selectedClaimIds.length === filteredClaims.length;
  const someSelected =
    selectedClaimIds.length > 0 &&
    selectedClaimIds.length < filteredClaims.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClaimIds(filteredClaims.map((c) => c.orderNumber.toString()));
    } else {
      setSelectedClaimIds([]);
    }
  };

  const handleSelectClaim = (claimId: string, checked: boolean) => {
    if (checked) {
      setSelectedClaimIds((prev) => [...prev, claimId]);
    } else {
      setSelectedClaimIds((prev) => prev.filter((id) => id !== claimId));
    }
  };

  const handleSendToFactoring = () => {
    const formData = new FormData();
    formData.append("actionType", "SEND_TO_FACTORING");
    formData.append("selectedClaims", JSON.stringify(selectedClaimIds));
    fetcher.submit(formData, {
      method: "post",
    });
    setSelectedClaimIds([]);
  };

  const handleDeleteSelected = async () => {
    const formData = new FormData();
    formData.append("actionType", "DELETE_CLAIMS");
    formData.append("selectedClaims", JSON.stringify(selectedClaimIds));
    fetcher.submit(formData, {
      method: "post",
    });
    setSelectedClaimIds([]);
  };

  return (
    <VStack gap="space-20">
      <NovariToaster items={alertState} position={"top-right"} />
      <PageHeader
        title="Ordre som ikke er sendt til fakturering"
        description={
          "Søk på ordrenummer i feltet under. Oversikten viser kun ordrer du har opprettet."
        }
      />

      <HStack gap="space-4" wrap align="end">
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
          onClick={handleSendToFactoring}
          disabled={selectedClaimIds.length === 0}
        >
          SEND ORDRE TIL FAKTURERING
        </Button>
      </HStack>

      <ClaimHistoryTable
        claims={filteredClaims}
        selectedClaimIds={selectedClaimIds}
        onSelectAll={handleSelectAll}
        onSelectClaim={handleSelectClaim}
        allSelected={allSelected}
        someSelected={someSelected}
        emptyMessage={
          filteredClaims.length === 0
            ? "Ingen Ordrer funnet"
            : "Ingen Ordrer tilgjengelig"
        }
      />

      <Box style={{ display: "flex", justifyContent: "flex-end" }}>
        {selectedClaimIds.length > 0 && (
          <NovariConfirmAction
            buttonText="SLETT VALGTE"
            buttonVariant="danger"
            titleText="Slett ordre"
            subTitleText={`Er du sikker på at du vil slette ${selectedClaimIds.length} element?`}
            onConfirm={() => handleDeleteSelected()}
          />
        )}
      </Box>
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

  let errors: number = 0;
  let response;

  switch (actionType) {
    case "DELETE_CLAIMS":
      for (const claimId of selectedClaimIds) {
        response = await ClaimApi.cancelClaim(selectedOrg, claimId);
        if (!response.success) {
          errors++;
        }
      }
      if (errors > 0) {
        response = {
          success: false,
          message: `${errors} ordre ikke slettet`,
          variant: "error",
        };
      } else {
        response = {
          success: true,
          message: `${selectedClaimIds.length} ordre slettet`,
          variant: "success",
        };
      }
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
