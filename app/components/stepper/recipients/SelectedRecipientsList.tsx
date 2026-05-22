import {Box, Detail, ExpansionCard, Heading, List} from "@navikt/ds-react";
import type {ICustomer} from "~/types/group";
import {TrashIcon} from "@navikt/aksel-icons";

interface SelectedRecipientsListProps {
  selectedRecipients: ICustomer[];
  onRemoveRecipient: (customer: ICustomer) => void;
  useExpansionCard?: boolean;
  showRemoveButton?: boolean;
}

export function SelectedRecipientsList({
  selectedRecipients,
  onRemoveRecipient,
  useExpansionCard,
                                           showRemoveButton
}: SelectedRecipientsListProps) {
    const elementsList = (
        <List as="ul">
            {selectedRecipients.map((person: ICustomer) => (
                <List.Item
                    key={person.id} // or other unique key
                    icon={showRemoveButton ? <TrashIcon aria-hidden /> : undefined}
                    onClick={showRemoveButton ? () => onRemoveRecipient(person) : undefined}
                >
                    {person.name}
                </List.Item>
            ))}
        </List>
    );



    return (

      // <VStack gap="space-4">
          <Box >
              {!useExpansionCard && (
                  <Heading size="small" level="4" spacing>
                      Valgte mottakere ({selectedRecipients.length})
                  </Heading>
              )}

              {useExpansionCard ? (
                  <ExpansionCard
                      aria-labelledby="selected-recipients-heading"
                  >
                      <ExpansionCard.Header>
                          <ExpansionCard.Title
                              size="small"
                              id="selected-recipients-heading"
                          >
                              Valgte mottakere ({selectedRecipients.length})
                          </ExpansionCard.Title>
                          {selectedRecipients.length === 0 &&

                              <ExpansionCard.Description>
                                  Ingen mottakere valgt
                              </ExpansionCard.Description>
                          }
                      </ExpansionCard.Header>
                      <ExpansionCard.Content>
                          {elementsList}
                      </ExpansionCard.Content>
                  </ExpansionCard>
              ) : (
                  <Box borderColor="brand-magenta-subtle"
                       padding="space-16"
                       borderWidth="2"
                       borderRadius="12"
                       height="20rem"
                       overflow="scroll"
                      // background="brand-beige-soft"
                  >
                      {selectedRecipients.length === 0 &&
                          <Detail>
                              Ingen mottakere valgt
                          </Detail>
                      }
                  <>{elementsList}</>
                      </Box>
              )}

          </Box>

      // </VStack>

  );
}

