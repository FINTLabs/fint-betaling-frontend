import { Box, Checkbox, Table } from "@navikt/ds-react";
import type { ICustomer } from "~/types/group";

interface PersonRecipientsTableProps {
  customers: ICustomer[];
  selectedRecipients: ICustomer[];
  onToggleRecipient: (customer: ICustomer, checked: boolean) => void;
}

export function PersonRecipientsTable({
  customers,
  selectedRecipients,
  onToggleRecipient,
}: PersonRecipientsTableProps) {
  return (
    <Box>
      <Table size="small" zebraStripes={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Velg</Table.HeaderCell>
            <Table.HeaderCell>Navn</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {customers.map((customer) => {
            const isSelected = selectedRecipients.some(
              (r) => r.id === customer.id,
            );
            return (
              <Table.Row key={customer.id} selected={isSelected}>
                <Table.DataCell>
                  <Checkbox
                      data-cy={`person-checkbox-${customer.name}`}
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
  );
}
