import { Box, Checkbox, CheckboxGroup, Table } from "@navikt/ds-react";
import type { IClassGroup, ICustomer } from "~/types/group";

interface GroupRecipientsTableProps {
  groups: IClassGroup[];
  selectedRecipients: ICustomer[];
  onToggleRecipient: (customer: ICustomer, checked: boolean) => void;
  onToggleGroup: (group: IClassGroup, checked: boolean) => void;
}

function getGroupCheckboxState(
  group: IClassGroup,
  selectedRecipients: ICustomer[],
) {
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
}

export function GroupRecipientsTable({
  groups,
  selectedRecipients,
  onToggleRecipient,
  onToggleGroup,
}: GroupRecipientsTableProps) {
  const selectedCustomerIds = selectedRecipients.map((r) => r.id);

  return (
    <Box>
      <Table size="small" zebraStripes={true}>
        <Table.Header>
          <Table.Row >
            <Table.HeaderCell />
            <Table.HeaderCell style={{ width: "60px" }}>
              Velg
            </Table.HeaderCell>
            <Table.HeaderCell>Navn</Table.HeaderCell>
            <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {groups.map((group) => {
            const checkboxState = getGroupCheckboxState(
              group,
              selectedRecipients,
            );

            return (
              <Table.ExpandableRow
                  selected={checkboxState.checked}
                key={group.name}
                content={
                  group.customers && group.customers.length > 0 ? (
                    <Box padding="space-4">
                      <CheckboxGroup

                        legend={`Elev:(${group.customers.length})`}
                        value={group.customers
                          .filter((c) => selectedCustomerIds.includes(c.id))
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
                              data-cy={`group-checkbox-${group.name}`}
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
                    <Box padding="space-4">
                      <p
                        style={{
                          margin: 0,
                          color: "var(--a-text-subtle)",
                        }}
                      >
                        Ingen elever tilgjengelig
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
                    onChange={(event) => {
                      onToggleGroup(
                        group,
                        event.target.checked || checkboxState.indeterminate,
                      );
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
  );
}
