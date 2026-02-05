import { Box, Button, VStack, ExpansionCard, Heading } from "@navikt/ds-react";
import type { ICustomer } from "~/types/group";
import { TrashIcon } from "@navikt/aksel-icons";

interface SelectedRecipientsListProps {
  selectedRecipients: ICustomer[];
  onRemoveRecipient: (customer: ICustomer) => void;
  useExpansionCard?: boolean;
}

const RecipientsContent = ({
  selectedRecipients,
  onRemoveRecipient,
}: {
  selectedRecipients: ICustomer[];
  onRemoveRecipient: (customer: ICustomer) => void;
}) => {
  if (selectedRecipients.length === 0) {
    return (
      <Box
        padding="4"
        background="surface-default"
        borderRadius="medium"
        style={{
          border: "1px dashed var(--a-border-subtle)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "var(--a-text-subtle)",
            margin: 0,
            fontSize: "0.875rem",
          }}
        >
          Ingen mottakere valgt ennå. Velg mottakere fra listen under.
        </p>
      </Box>
    );
  }

  return (
    <VStack gap="2">
      {selectedRecipients.map((person) => (
        <Box
          key={person.id}
          padding="3"
          background="surface-default"
          borderRadius="medium"
          borderWidth="1"
          borderColor="border-subtle"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flex: 1,
            }}
          >
            {/* Person icon */}
            <Box
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "var(--a-surface-info-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: "var(--a-text-default)" }}
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  fill="currentColor"
                />
                <path
                  d="M12 14C7.58172 14 4 15.7909 4 18V20H20V18C20 15.7909 16.4183 14 12 14Z"
                  fill="currentColor"
                />
              </svg>
            </Box>
            <span style={{ fontSize: "0.875rem", fontWeight: 400 }}>
              {person.name}
            </span>
          </Box>
          <Button
            icon={<TrashIcon title="Fjern" />}
            onClick={() => onRemoveRecipient(person)}
            variant="tertiary"
            size="small"
          />
        </Box>
      ))}
    </VStack>
  );
};

export function SelectedRecipientsList({
  selectedRecipients,
  onRemoveRecipient,
  useExpansionCard = false,
}: SelectedRecipientsListProps) {
  if (useExpansionCard) {
    return (
      <ExpansionCard
        // defaultOpen={selectedRecipients.length > 0}
        aria-labelledby="selected-recipients-heading"
      >
        <ExpansionCard.Header>
          <ExpansionCard.Title size="small" id="selected-recipients-heading">
            Valgte mottakere ({selectedRecipients.length})
          </ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <RecipientsContent
            selectedRecipients={selectedRecipients}
            onRemoveRecipient={onRemoveRecipient}
          />
        </ExpansionCard.Content>
      </ExpansionCard>
    );
  }

  return (
    <Box
      padding="6"
      background="surface-subtle"
      borderRadius="large"
      borderWidth="1"
      borderColor="border-subtle"
    >
      <VStack gap="3">
        <Heading size="small" level="4" spacing>
          Valgte mottakere ({selectedRecipients.length})
        </Heading>
        <RecipientsContent
          selectedRecipients={selectedRecipients}
          onRemoveRecipient={onRemoveRecipient}
        />
      </VStack>
    </Box>
  );
}
