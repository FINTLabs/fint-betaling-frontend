import {Detail, HStack, Pagination, Select} from "@navikt/ds-react";

interface SelectAndPagingProps {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  totalOrders: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

export function SelectAndPaging({
  page,
  totalPages,
  rowsPerPage,
  totalOrders,
  onPageChange,
  onRowsPerPageChange,
}: SelectAndPagingProps) {
  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = Math.min(page * rowsPerPage, totalOrders);

  return (
    <HStack gap="space-4" justify="space-between" align="center">
      <HStack gap="space-2" align="center">
        <Detail style={{ fontSize: "0.875rem" }}>Rows per page:</Detail>
        <Select
          label="Rows per page"
          value={rowsPerPage.toString()}
          onChange={(e) => {
            onRowsPerPageChange(Number(e.target.value));
            onPageChange(1);
          }}
          // style={{ width: "80px" }}
          hideLabel
          size="small"
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Select>
      </HStack>
      <Pagination
          page={page}
          onPageChange={onPageChange}
          count={totalPages}
          size="small"
      />
        <span style={{ fontSize: "0.875rem" }}>
          {startIndex}-{endIndex} of {totalOrders}
        </span>


    </HStack>
  );
}
