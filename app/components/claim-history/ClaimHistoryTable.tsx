import { Box, Table, Checkbox } from "@navikt/ds-react";
import { useMemo } from "react";
import React from "react";
import type { IClaim } from "~/types/claim";
import { ClaimStatusBadge } from "./ClaimStatusBadge";
import { formatCurrency, formatDate } from "~/utils/variousFormats";
import "@navikt/ds-css";

interface OrderHistoryTableProps {
  claims: IClaim[];
  selectedClaimIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectClaim: (orderId: string, checked: boolean) => void;
  allSelected: boolean;
  someSelected: boolean;
  emptyMessage?: string;
}

export function ClaimHistoryTable({
  claims,
  selectedClaimIds,
  onSelectAll,
  onSelectClaim,
  allSelected,
  someSelected,
  emptyMessage = "Ingen ordrer tilgjengelig",
}: OrderHistoryTableProps) {
  const groupedOrders = useMemo(() => {
    const groups: Array<{ date: string; orders: IClaim[] }> = [];
    const dateMap = new Map<string, IClaim[]>();

    claims.forEach((order) => {
      // Extract just the date part (YYYY-MM-DD) from ISO string
      const dateKey = order.createdDate.split("T")[0];
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(order);
    });

    // Convert to array and sort by date (newest first)
    dateMap.forEach((orders, date) => {
      groups.push({ date, orders });
    });

    return groups.sort((a, b) => b.date.localeCompare(a.date));
  }, [claims]);

  return (
    <Box
      borderColor="neutral-subtle"
      padding="space-16"
      borderWidth="2"
      borderRadius="12"
      width="100%"
      shadow="dialog"
    >
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style={{ width: "60px" }}>
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                hideLabel
              >
                Velg alle
              </Checkbox>
            </Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Navn</Table.HeaderCell>
            <Table.HeaderCell>Skole</Table.HeaderCell>
            <Table.HeaderCell>Ansatt</Table.HeaderCell>
            <Table.HeaderCell>Ordrenummer</Table.HeaderCell>
            <Table.HeaderCell>Faktura</Table.HeaderCell>
            <Table.HeaderCell align="right">Netto totalpris</Table.HeaderCell>
            <Table.HeaderCell align="right">Å betale</Table.HeaderCell>
            <Table.HeaderCell>Opprettet</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {claims.length === 0 ? (
            <Table.Row>
              <Table.DataCell colSpan={10} style={{ textAlign: "center" }}>
                {emptyMessage}
              </Table.DataCell>
            </Table.Row>
          ) : (
            groupedOrders.map((batch, batchIndex) => (
              <React.Fragment key={batch.date}>
                {/* Batch header row - show for batches with multiple orders */}
                {batch.orders.length > 1 && (
                  <Table.Row>
                    <Table.DataCell
                      colSpan={10}
                      style={{
                        padding: "0.75rem 1rem",
                        borderTop:
                          batchIndex > 0
                            ? "2px solid var(--a-border-subtle)"
                            : undefined,
                        backgroundColor: "var(--ax-bg-neutral-soft)",
                      }}
                    >
                      <Box
                        // background={"bg-neutral-soft"}
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--a-text-default)",
                          fontWeight: 600,
                          backgroundColor: "var(--ax-bg-neutral-soft)",
                        }}
                      >
                        Batch: {formatDate(batch.date)} ({batch.orders.length}{" "}
                        {batch.orders.length === 1 ? "ordre" : "ordrer"})
                      </Box>
                    </Table.DataCell>
                  </Table.Row>
                )}
                {/* Orders in this batch */}
                {batch.orders.map((order) => {
                  const orderId = order.orderNumber.toString();
                  const isSelected = selectedClaimIds.includes(orderId);
                  const isRowSelectable =
                    order.claimStatus === "SEND_ERROR" ||
                    order.claimStatus === "STORED" ||
                    order.claimStatus === "ACCEPT_ERROR";
                  const netTotalPrice = order.originalAmountDue;
                  const amountDue = order.amountDue;
                  const invoiceNumbers =
                    order.invoiceNumbers.length > 0
                      ? order.invoiceNumbers.join(", ")
                      : "";

                  return (
                    <Table.Row
                      key={order.orderNumber}
                      selected={isSelected}
                      onRowClick={
                        isRowSelectable
                          ? () => onSelectClaim(orderId, !isSelected)
                          : undefined
                      }
                      style={{
                        ...(!isRowSelectable
                          ? { opacity: 0.6, cursor: "not-allowed" }
                          : {}),
                      }}
                    >
                      <Table.DataCell>
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) =>
                            onSelectClaim(orderId, e.target.checked)
                          }
                          disabled={!isRowSelectable}
                          hideLabel
                          onClick={(e) => e.stopPropagation()}
                        >
                          Velg {order.orderNumber}
                        </Checkbox>
                      </Table.DataCell>
                      <Table.DataCell>
                        <ClaimStatusBadge
                          claimStatus={order.claimStatus}
                          statusMessage={order.statusMessage}
                        />
                      </Table.DataCell>
                      <Table.DataCell>{order.customerName}</Table.DataCell>

                      <Table.DataCell>
                        {order.organisationUnit.name}
                      </Table.DataCell>
                      <Table.DataCell>
                        {order.createdByEmployee || "-"}
                      </Table.DataCell>
                      <Table.DataCell>
                        <strong>{order.orderNumber}</strong>
                      </Table.DataCell>

                      <Table.DataCell>{invoiceNumbers || "-"}</Table.DataCell>
                      <Table.DataCell align="right">
                        <strong>{formatCurrency(netTotalPrice)}</strong>
                      </Table.DataCell>
                      <Table.DataCell align="right">
                        {amountDue !== null ? formatCurrency(amountDue) : "-"}
                      </Table.DataCell>
                      <Table.DataCell>
                        {formatDate(order.createdDate)}
                      </Table.DataCell>
                    </Table.Row>
                  );
                })}
              </React.Fragment>
            ))
          )}
        </Table.Body>
      </Table>
    </Box>
  );
}
