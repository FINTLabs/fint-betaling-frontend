import { Box, Detail, Heading, HStack, VStack } from "@navikt/ds-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  type RecipientType,
  RecipientTypeSelector,
} from "./RecipientTypeSelector";
import { GroupRecipientsTable } from "./GroupRecipientsTable";
import { PersonRecipientsTable } from "./PersonRecipientsTable";
import { StepNavigation } from "../StepNavigation";
import { FileUploadModal } from "./FileUploadModal";
import type { IClassGroup, ICustomer } from "~/types/group";
import FileApi from "~/api/FileApi";
import SelectedRecipientsModal from "~/components/stepper/recipients/SelectedRecipientsModal";
import { SelectAndPaging } from "~/components/SelectAndPaging";

interface SelectRecipientStepProps {
  groupRecipients: IClassGroup[];
  personRecipients: ICustomer[];
  selectedRecipients: ICustomer[];
  setSelectedRecipients: (
    recipients: ICustomer[] | ((prev: ICustomer[]) => ICustomer[]),
  ) => void;
  onNext: () => void;
  currentSchoolOrgId: string;
}

export function SelectRecipientStep({
  groupRecipients,
  personRecipients,
  selectedRecipients,
  setSelectedRecipients,
  onNext,
  currentSchoolOrgId,
}: SelectRecipientStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipientType, setRecipientType] = useState<RecipientType>("gruppe");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groupRecipients;
    const query = searchQuery.toLowerCase();
    return groupRecipients.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query),
    );
  }, [groupRecipients, searchQuery]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return personRecipients;
    const query = searchQuery.toLowerCase();
    return personRecipients.filter((customer) =>
      customer.name.toLowerCase().includes(query),
    );
  }, [personRecipients, searchQuery]);

  const hasResults =
    recipientType === "person"
      ? filteredCustomers.length > 0
      : filteredGroups.length > 0;

  const currentTotal =
    recipientType === "person"
      ? filteredCustomers.length
      : filteredGroups.length;
  const totalPages = Math.max(1, Math.ceil(currentTotal / rowsPerPage));
  const paginatedGroups = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredGroups.slice(start, start + rowsPerPage);
  }, [filteredGroups, page, rowsPerPage]);
  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredCustomers.slice(start, start + rowsPerPage);
  }, [filteredCustomers, page, rowsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, recipientType]);

  const handleFileUpload = (file: File) => {
    console.log("File selected:", file.name);

    FileApi.sendFile(currentSchoolOrgId, file);
  };

  function handleToggleRecipient(recipient: ICustomer, checked: boolean) {
    if (!checked) {
      setSelectedRecipients((prev) =>
        prev.filter((r: ICustomer) => r.id !== recipient.id),
      );
      return;
    } else {
      setSelectedRecipients((prev) => {
        const isAlreadySelected = prev.some(
          (r: ICustomer) => r.id === recipient.id,
        );
        if (isAlreadySelected) {
          return prev;
        } else {
          return [...prev, recipient];
        }
      });
    }
  }

  function handleToggleGroup(group: IClassGroup, checked: boolean) {
    if (!checked) {
      const groupCustomerIds = group.customers.map((c) => c.id);
      setSelectedRecipients((prev) =>
        prev.filter((r) => !groupCustomerIds.includes(r.id)),
      );
    } else {
      setSelectedRecipients((prev) => {
        const existingIds = prev.map((r) => r.id);
        const newCustomers = group.customers.filter(
          (c) => !existingIds.includes(c.id),
        );
        return [...prev, ...newCustomers];
      });
    }
  }

  return (
    <VStack gap="space-16">
      <FileUploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileUpload={handleFileUpload}
      />

      <Box
        paddingBlock="space-6"
        paddingInline="space-0"
        style={{
          borderBottom: "1px solid #e0e0e0",
          marginBottom: "1.5rem",
        }}
      >
        <HStack justify="space-between" align="end">
          <VStack gap="space-2" align="start">
            <Heading size="medium" level="2" spacing>
              Velg mottakere:
            </Heading>
            <Detail>
              Bruk filter og søkefunksjonen for å finne mottakere, eller last
              opp en fil med mottakere.
            </Detail>
          </VStack>
          <SelectedRecipientsModal
            selectedRecipients={selectedRecipients}
            showRemoveButton={false}
          />
        </HStack>
      </Box>

      <VStack gap="space-6">
        <Box>
          <Heading size="small" level="4" spacing>
            Tilgjengelige mottakere (
            {recipientType === "person"
              ? filteredCustomers.length
              : filteredGroups.length}
            )
          </Heading>
        </Box>

        <HStack gap="space-6" align="end" wrap>
          <RecipientTypeSelector
            recipientType={recipientType}
            onRecipientTypeChange={setRecipientType}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          {/*<Button*/}
          {/*  variant="secondary"*/}
          {/*  size="small"*/}
          {/*  onClick={() => setIsUploadModalOpen(true)}*/}
          {/*  icon={<CloudUpIcon title="a11y-title" fontSize="1.5rem" />}*/}
          {/*/>*/}
          {/*  Last opp fil med mottakere*/}
          {/*</Button>*/}
        </HStack>

        {!hasResults ? (
          <Detail>
            {searchQuery
              ? "Ingen resultater funnet for søket ditt"
              : "Ingen mottakere tilgjengelig"}
          </Detail>
        ) : (
          <>
            {recipientType === "person" ? (
              <PersonRecipientsTable
                customers={paginatedCustomers}
                selectedRecipients={selectedRecipients}
                onToggleRecipient={handleToggleRecipient}
              />
            ) : (
              <GroupRecipientsTable
                groups={paginatedGroups}
                selectedRecipients={selectedRecipients}
                onToggleRecipient={handleToggleRecipient}
                onToggleGroup={handleToggleGroup}
              />
            )}
          </>
        )}
      </VStack>

      {currentTotal && currentTotal > 25 && (
        <SelectAndPaging
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalOrders={currentTotal}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}
      <StepNavigation
        onNext={onNext}
        nextButtonText="Videre til produktvalg"
        disabled={selectedRecipients.length === 0}
      />
    </VStack>
  );
}
