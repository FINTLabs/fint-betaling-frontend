import {Box, Button, Detail, Heading, HStack, VStack} from "@navikt/ds-react";
import React, { useMemo, useState } from "react";
import { SelectedRecipientsList } from "./SelectedRecipientsList";
import { RecipientTypeSelector, type RecipientType } from "./RecipientTypeSelector";
import { GroupRecipientsTable } from "./GroupRecipientsTable";
import { PersonRecipientsTable } from "./PersonRecipientsTable";
import { StepNavigation } from "../StepNavigation";
import { FileUploadModal } from "./FileUploadModal";
import type { IClassGroup, ICustomer } from "~/types/group";
import FileApi from "~/api/FileApi";

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

  const handleFileUpload = (file: File) => {
    console.log("File selected:", file.name);

    FileApi.sendFile(currentSchoolOrgId, file);
  };

  function handleToggleRecipient(recipient: ICustomer, checked: boolean) {
    if (!checked) {
      // Remove recipient by comparing IDs
      setSelectedRecipients((prev) =>
        prev.filter((r: ICustomer) => r.id !== recipient.id),
      );
      return;
    } else {
      // Add recipient if not already in list (check by ID)
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
      // Remove all customers from this group
      const groupCustomerIds = group.customers.map((c) => c.id);
      setSelectedRecipients((prev) =>
        prev.filter((r) => !groupCustomerIds.includes(r.id)),
      );
    } else {
      // Add all customers from this group
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
      <VStack gap="space-16" >

      {/*<Box padding="space-16" background="brand-beige-soft">*/}
        {/*    Denne boksen har background=&quot;brand-beige-soft&quot;*/}
        {/*</Box>*/}


      {/* File Upload Button */}
      {/*<VStack gap="space-4">*/}
        {/*<Button*/}
        {/*  variant="secondary"*/}
        {/*  size="small"*/}
        {/*  onClick={() => setIsUploadModalOpen(true)}*/}
        {/*>*/}
        {/*  Last opp fil med mottakere*/}
        {/*</Button>*/}


        {/*<HStack gap="space-24">*/}
        {/*  <FileUpload.Dropzone*/}
        {/*    label="Last opp studentliste"*/}
        {/*    fileLimit={{ max: 1, current: files.length }}*/}
        {/*    multiple={false}*/}
        {/*    onSelect={setFiles}*/}
        {/*  />*/}
        {/*  {files.map((file: { file: FileItem }) => (*/}
        {/*    <FileUpload.Item*/}
        {/*      key={file.file.name}*/}
        {/*      file={file.file}*/}
        {/*      button={{*/}
        {/*        action: "delete",*/}
        {/*        onClick: () => setFiles([]),*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  ))}*/}
        {/*</HStack>*/}
      {/*</VStack>*/}

      <FileUploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileUpload={handleFileUpload}
      />

        <SelectedRecipientsList
            selectedRecipients={selectedRecipients}
            onRemoveRecipient={(customer) => handleToggleRecipient(customer, false)}
        />

      {/*<Box*/}
      {/*  padding="space-6"*/}
      {/*  background="surface-default"*/}
      {/*  borderRadius="large"*/}
      {/*  borderWidth="1"*/}
      {/*  borderColor="border-subtle"*/}
      {/*>*/}
        <VStack gap="space-6">
          {/*<Box>*/}
            <Heading size="small" level="4" spacing>
              Tilgjengelige mottakere (
              {recipientType === "person"
                ? filteredCustomers.length
                : filteredGroups.length}
              )
            </Heading>
          {/*</Box>*/}

          <HStack gap="space-6" align="end" wrap>
          <RecipientTypeSelector
            recipientType={recipientType}
            onRecipientTypeChange={setRecipientType}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
            <Button
              variant="secondary"
              size="small"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Last opp fil med mottakere
            </Button>
          </HStack>

          {!hasResults ? (
            // <Box
            //   paddingBlock="8"
            //   paddingInline="4"
            //   style={{ textAlign: "center" }}
            // >
              <Detail>
                {searchQuery
                  ? "Ingen resultater funnet for søket ditt"
                  : "Ingen mottakere tilgjengelig"}
              </Detail>
            // </Box>
          ) : recipientType === "person" ? (
            <PersonRecipientsTable
              customers={filteredCustomers}
              selectedRecipients={selectedRecipients}
              onToggleRecipient={handleToggleRecipient}
            />
          ) : (
            <GroupRecipientsTable
              groups={filteredGroups}
              selectedRecipients={selectedRecipients}
              onToggleRecipient={handleToggleRecipient}
              onToggleGroup={handleToggleGroup}
            />
          )}
        </VStack>
      {/*</Box>*/}

        {/* Selected Recipients Section */}

      {/*<p*/}
      {/*  style={{*/}
      {/*    margin: 0,*/}
      {/*    color: "var(--a-text-subtle)",*/}
      {/*    fontSize: "0.875rem",*/}
      {/*  }}*/}
      {/*>*/}
        <Box>
        {selectedRecipients.length > 0 && (
          <span>
            {selectedRecipients.length} mottaker
            {selectedRecipients.length !== 1 ? "e" : ""} valgt
          </span>
        )}</Box>
      {/*</p>*/}
      {/* Action Button Section */}
      <StepNavigation
        onNext={onNext}
        nextButtonText="Videre til produktvalg"
        disabled={selectedRecipients.length === 0}
      />
    </VStack>
  );
}
