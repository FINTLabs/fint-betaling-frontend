import { Box, Button, VStack } from "@navikt/ds-react";
import React, { useState } from "react";
import { SelectedRecipientsList } from "./SelectedRecipientsList";
import { RecipientsTable } from "./RecipientsTable";
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
    <VStack gap="6">
      {/* Selected Recipients Section */}
      <SelectedRecipientsList
        selectedRecipients={selectedRecipients}
        onRemoveRecipient={(customer) => handleToggleRecipient(customer, false)}
      />

      {/* File Upload Button */}
      <Box>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setIsUploadModalOpen(true)}
        >
          Last opp fil med mottakere
        </Button>
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
      </Box>

      <FileUploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileUpload={handleFileUpload}
      />

      {/* Recipients Table Section */}
      <RecipientsTable
        personRecipients={personRecipients}
        groupRecipients={groupRecipients}
        selectedRecipients={selectedRecipients}
        onToggleGroup={handleToggleGroup}
        onToggleRecipient={handleToggleRecipient}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <p
        style={{
          margin: 0,
          color: "var(--a-text-subtle)",
          fontSize: "0.875rem",
        }}
      >
        {selectedRecipients.length > 0 && (
          <span>
            {selectedRecipients.length} mottaker
            {selectedRecipients.length !== 1 ? "e" : ""} valgt
          </span>
        )}
      </p>
      {/* Action Button Section */}
      <StepNavigation
        onNext={onNext}
        nextButtonText="Videre til produktvalg"
        disabled={selectedRecipients.length === 0}
      />
    </VStack>
  );
}
