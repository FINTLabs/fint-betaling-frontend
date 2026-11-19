import { Box, Heading, HStack, Loader, Table, VStack } from "@navikt/ds-react";
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
  loading?: boolean;
  error?: boolean;
}

export function BatchHistory({ batches, loading, error }: BatchHistoryProps) {
  return (
    <VStack gap="space-4" align="start">
      <Heading size="medium" level="3" spacing>
        Batch historikk
      </Heading>
      <Box
        borderColor="neutral-subtle"
        padding="space-16"
        borderWidth="2"
        borderRadius="12"
        width="100%"
        shadow="dialog"
      >
        {loading ? (
          <HStack gap="space-8" align="center" role="status">
            <Loader size="small" aria-hidden="true" />
            <span>Henter batchhistorikk …</span>
          </HStack>
        ) : error ? (
          <p role="alert">Kunne ikke hente batchhistorikk.</p>
        ) : batches.length === 0 ? (
          <Box paddingBlock="space-4">
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
          <Table size="small" zebraStripes={true}>
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
                    {formatDate(batch.date)}
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
      </Box>
    </VStack>
  );
}
