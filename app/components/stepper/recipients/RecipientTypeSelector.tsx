import { Box, HStack, Radio, RadioGroup, TextField } from "@navikt/ds-react";

export type RecipientType = "gruppe" | "person";

interface RecipientTypeSelectorProps {
  recipientType: RecipientType;
  onRecipientTypeChange: (value: RecipientType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function RecipientTypeSelector({
  recipientType,
  onRecipientTypeChange,
  searchQuery,
  onSearchChange,
}: RecipientTypeSelectorProps) {
  return (
    // <Box
    //   padding="space-4"
    //   borderRadius="12"
    //   borderWidth="1"
    //   borderColor="border-subtle"
    // >
      <>
        <Box style={{ minWidth: "200px", flex: "0 0 auto" }}>
          <RadioGroup
            legend="Mottakertype"
            value={recipientType}
            onChange={(value) => onRecipientTypeChange(value as RecipientType)}
            size="small"
          >
            <HStack gap="space-24">
              <Radio value="gruppe">Gruppe</Radio>
              <Radio value="person">Person</Radio>
            </HStack>
          </RadioGroup>
        </Box>

        <Box style={{ flex: "1 1 auto", minWidth: "250px" }}>
          <TextField
            label={
              recipientType === "gruppe"
                ? "Søk på gruppenavn"
                : "Søk på navn"
            }
            size="small"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              recipientType === "gruppe"
                ? "Søk på gruppenavn"
                : "Søk på etternavn, fornavn mellomnavn"
            }
          />
        </Box>
      </>
    // </Box>
  );
}
