import { Box, Select, HStack, Pagination } from "@navikt/ds-react";

interface OrderHistoryPaginationProps {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  totalOrders: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

export function ClaimHistoryPagination({
  page,
  totalPages,
  rowsPerPage,
  totalOrders,
  onPageChange,
  onRowsPerPageChange,
}: OrderHistoryPaginationProps) {
  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = Math.min(page * rowsPerPage, totalOrders);

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <HStack gap="2" align="center">
        <span style={{ fontSize: "0.875rem" }}>Rows per page:</span>
        <Select
          label="Rows per page"
          value={rowsPerPage.toString()}
          onChange={(e) => {
            onRowsPerPageChange(Number(e.target.value));
            onPageChange(1);
          }}
          style={{ width: "80px" }}
          hideLabel
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Select>
      </HStack>
      <HStack gap="2" align="center">
        <span style={{ fontSize: "0.875rem" }}>
          {startIndex}-{endIndex} of {totalOrders}
        </span>
        <Pagination
          page={page}
          onPageChange={onPageChange}
          count={totalPages}
          size="small"
        />
      </HStack>
    </Box>
  );
}
