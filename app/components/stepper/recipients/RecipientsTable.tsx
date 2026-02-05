import {
  Box,
  Heading,
  VStack,
  Table,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  TextField,
  HStack,
} from "@navikt/ds-react";
import { useMemo, useState } from "react";
import type { IClassGroup, ICustomer } from "~/types/group";

interface RecipientsTableProps {
  personRecipients: ICustomer[];
  groupRecipients?: IClassGroup[];
  selectedRecipients: ICustomer[];
  onToggleRecipient: (customer: ICustomer, checked: boolean) => void;
  onToggleGroup?: (group: IClassGroup, checked: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function RecipientsTable({
  personRecipients,
  groupRecipients,
  selectedRecipients,
  onToggleRecipient,
  onToggleGroup,
  searchQuery,
  onSearchChange,
}: RecipientsTableProps) {
  const [recipientType, setRecipientType] = useState<string>("gruppe");

  // Filter groups based on search query
  const filteredGroups = useMemo(() => {
    if (!groupRecipients) return [];
    if (!searchQuery) return groupRecipients;

    const query = searchQuery.toLowerCase();
    return groupRecipients.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query),
    );
  }, [groupRecipients, searchQuery]);

  // Filter customers based on search query
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

  // Get checkbox state for a group
  const getGroupCheckboxState = (group: IClassGroup) => {
    const selectedCustomerIds = selectedRecipients.map((r) => r.id);
    const groupCustomerIds = group.customers.map((c) => c.id);
    const selectedCount = groupCustomerIds.filter((id) =>
      selectedCustomerIds.includes(id),
    ).length;
    const totalCount = group.customers.length;

    return {
      checked: selectedCount === totalCount && totalCount > 0,
      indeterminate: selectedCount > 0 && selectedCount < totalCount,
    };
  };
  return (
    <Box
      padding="6"
      background="surface-default"
      borderRadius="large"
      borderWidth="1"
      borderColor="border-subtle"
    >
      <VStack gap="6">
        <Box>
          <Heading size="small" level="4" spacing>
            Tilgjengelige mottakere (
            {recipientType === "person"
              ? filteredCustomers.length
              : filteredGroups.length}
            )
          </Heading>
        </Box>

        {/* Search and Filter Section */}
        <Box
          padding="4"
          background="surface-subtle"
          borderRadius="medium"
          borderWidth="1"
          borderColor="border-subtle"
        >
          <HStack gap="6" align="end" wrap>
            <Box style={{ minWidth: "200px", flex: "0 0 auto" }}>
              <RadioGroup
                legend="Mottakertype"
                value={recipientType}
                onChange={(value) => setRecipientType(value)}
                size="small"
              >
                <HStack gap="6">
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
          </HStack>
        </Box>

        {!hasResults ? (
          <Box
            paddingBlock="8"
            paddingInline="4"
            style={{ textAlign: "center" }}
          >
            <p
              style={{
                color: "var(--a-text-subtle)",
                margin: 0,
                fontSize: "0.875rem",
              }}
            >
              {searchQuery
                ? "Ingen resultater funnet for søket ditt"
                : "Ingen mottakere tilgjengelig"}
            </p>
          </Box>
        ) : recipientType === "person" ? (
          <Box>
            <Table size="small">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Velg</Table.HeaderCell>
                  <Table.HeaderCell>Navn</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredCustomers.map((customer) => {
                  const isSelected = selectedRecipients.some(
                    (r) => r.id === customer.id,
                  );
                  return (
                    <Table.Row key={customer.id}>
                      <Table.DataCell>
                        <Checkbox
                          checked={isSelected}
                          onChange={() =>
                            onToggleRecipient(customer, !isSelected)
                          }
                          hideLabel
                        >
                          Velg {customer.name}
                        </Checkbox>
                      </Table.DataCell>
                      <Table.DataCell>
                        <strong>{customer.name}</strong>
                      </Table.DataCell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Box>
        ) : (
          <Box>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell style={{ width: "60px" }}>
                    Velg
                  </Table.HeaderCell>
                  <Table.HeaderCell>Navn</Table.HeaderCell>
                  <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredGroups.map((group) => {
                  const checkboxState = getGroupCheckboxState(group);
                  const selectedCustomerIds = selectedRecipients.map(
                    (r) => r.id,
                  );

                  return (
                    <Table.ExpandableRow
                      key={group.name}
                      content={
                        group.customers && group.customers.length > 0 ? (
                          <Box padding="4">
                            <CheckboxGroup
                              legend={`Kunder (${group.customers.length})`}
                              value={group.customers
                                .filter((c) =>
                                  selectedCustomerIds.includes(c.id),
                                )
                                .map((c) => c.id)}
                              onChange={(value) => {
                                const newValue = value as string[];
                                group.customers.forEach((customer) => {
                                  const wasSelected =
                                    selectedCustomerIds.includes(customer.id);
                                  const isNowSelected = newValue.includes(
                                    customer.id,
                                  );
                                  if (wasSelected !== isNowSelected) {
                                    onToggleRecipient(customer, isNowSelected);
                                  }
                                });
                              }}
                              size="small"
                            >
                              {group.customers.map((customer) => (
                                <Checkbox
                                  key={customer.id}
                                  value={customer.id}
                                  style={{ marginBottom: "0.25rem" }}
                                >
                                  {customer.name}
                                </Checkbox>
                              ))}
                            </CheckboxGroup>
                          </Box>
                        ) : (
                          <Box padding="4">
                            <p
                              style={{
                                margin: 0,
                                color: "var(--a-text-subtle)",
                              }}
                            >
                              Ingen kunder tilgjengelig
                            </p>
                          </Box>
                        )
                      }
                      expansionDisabled={
                        !group.customers || group.customers.length === 0
                      }
                    >
                      <Table.DataCell>
                        <Checkbox
                          checked={checkboxState.checked}
                          indeterminate={checkboxState.indeterminate}
                          onChange={() => {
                            if (onToggleGroup) {
                              onToggleGroup(group, !checkboxState.checked);
                            }
                          }}
                          hideLabel
                        >
                          Velg {group.name}
                        </Checkbox>
                      </Table.DataCell>
                      <Table.DataCell>
                        <strong>{group.name}</strong>
                      </Table.DataCell>
                      <Table.DataCell>{group.description}</Table.DataCell>
                    </Table.ExpandableRow>
                  );
                })}
              </Table.Body>
            </Table>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
