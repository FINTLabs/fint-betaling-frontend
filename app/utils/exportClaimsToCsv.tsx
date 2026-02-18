import type { IClaim } from "~/types/claim";
import { formatCurrency, formatDate } from "~/utils/variousFormats";

/**
 * Escapes CSV values safely (handles commas, quotes, line breaks)
 */
const csvEscape = (value: unknown): string => {
    const s = value == null ? "" : String(value);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * Converts rows to CSV with Excel-friendly BOM + CRLF
 */
const buildCsv = (rows: string[][]): string => {
    return "\uFEFF" + rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
};

/**
 * Triggers file download in browser
 */
const downloadCsv = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
};

/**
 * Exports claims exactly as displayed in ClaimHistoryTable
 */
export const exportClaimsToCsv = (claims: IClaim[]) => {
    const header = [
        "Status",
        "Navn",
        "Skole",
        "Ordrenummer",
        "Fakturanummer",
        "Netto totalpris",
        "Å betale",
        "Opprettet",
    ];

    const rows = claims.map((order) => {
        const invoiceNumbers =
            order.invoiceNumbers.length > 0
                ? order.invoiceNumbers.join(", ")
                : order.invoiceNumbersCommaSeperated || "-";

        const netTotalPrice = formatCurrency(order.originalAmountDue);

        const amountDue =
            order.amountDue !== null ? formatCurrency(order.amountDue) : "-";

        const statusText = order.statusMessage
            ? `${order.claimStatus} - ${order.statusMessage}`
            : order.claimStatus;

        return [
            statusText,
            order.customerName,
            order.organisationUnit.name,
            String(order.orderNumber),
            invoiceNumbers,
            netTotalPrice,
            amountDue,
            formatDate(order.createdDate),
        ];
    });

    const csv = buildCsv([header, ...rows]);

    const filename = `krav-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsv(csv, filename);
};
