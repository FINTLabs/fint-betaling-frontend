import { Box, Heading, Table, VStack } from "@navikt/ds-react";
import { formatDate } from "~/utils/variousFormats";

export interface BatchData {
  date: string;
  totalRecords: number;
  sent: number;
  errors: number;
  stored: number;
  cancelled: number;
}

interface BatchHistoryProps {
  batches: BatchData[];
}

export function BatchHistory({ batches }: BatchHistoryProps) {
  return (
    <Box
      padding="6"
      background="surface-default"
      borderRadius="large"
      borderWidth="1"
      borderColor="border-subtle"
    >
      <VStack gap="4" align="start">
        <Heading size="medium" level="3" spacing>
          Batch historikk
        </Heading>
        {batches.length === 0 ? (
          <Box paddingBlock="4">
            <p
              style={{
                margin: 0,
                color: "var(--a-text-subtle)",
                fontSize: "0.875rem",
              }}
            >
              Ingen ordrer funnet de siste 14 dagene
            </p>
          </Box>
        ) : (
          <Table size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Batch Dato</Table.HeaderCell>
                <Table.HeaderCell align="right">Totalt</Table.HeaderCell>
                <Table.HeaderCell align="right">Sendt</Table.HeaderCell>
                <Table.HeaderCell align="right">Feil</Table.HeaderCell>
                <Table.HeaderCell align="right">Ikke sendt</Table.HeaderCell>
                <Table.HeaderCell align="right">Kansellert</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {batches.map((batch) => (
                <Table.Row key={batch.date}>
                  <Table.DataCell>
                    {formatDate(batch.date + "T00:00:00")}
                  </Table.DataCell>
                  <Table.DataCell align="right">
                    <strong>{batch.totalRecords}</strong>
                  </Table.DataCell>
                  <Table.DataCell align="right">{batch.sent}</Table.DataCell>
                  <Table.DataCell align="right">
                    {batch.errors > 0 ? (
                      <span style={{ color: "var(--a-text-danger)" }}>
                        {batch.errors}
                      </span>
                    ) : (
                      batch.errors
                    )}
                  </Table.DataCell>
                  <Table.DataCell align="right">{batch.stored}</Table.DataCell>
                  <Table.DataCell align="right">
                    {batch.cancelled}
                  </Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </VStack>
    </Box>
  );
}
