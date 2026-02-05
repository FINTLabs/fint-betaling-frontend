import { Box, Select, HStack } from "@navikt/ds-react";
import { ORDER_STATUS_LIST } from "./OrderStatusConfig";

interface OrderHistoryFiltersProps {
  dateFilter?: string;
  statusFilter?: string;
  schoolSelection?: string;
  organisationUnits?: Array<{ organisationNumber: string; name: string }>;
  statusCounts?: Record<string, number>;
  onDateFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSchoolSelectionChange: (value: string) => void;
}

export function OrderHistoryFilters({
  dateFilter,
  statusFilter,
  schoolSelection,
  organisationUnits = [],
  statusCounts = {},
  onDateFilterChange,
  onStatusFilterChange,
  onSchoolSelectionChange,
}: OrderHistoryFiltersProps) {
  return (
    <HStack gap="4" wrap align="end">
      <Box style={{ minWidth: "200px" }}>
        <Select
          label="Dato"
          size="small"
          value={dateFilter || "ALL"}
          onChange={(e) => onDateFilterChange(e.target.value)}
        >
          <option value="ALL">Alle</option>
          <option value="WEEK">Denne uka</option>
          <option value="MONTH">Denne måneden</option>
          <option value="YEAR">Dette året</option>
        </Select>
      </Box>
      <Box style={{ minWidth: "200px" }}>
        <Select
          label="Status"
          size="small"
          value={statusFilter || "all"}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="all">Alle</option>
          {ORDER_STATUS_LIST.map((status) => {
            const count = statusCounts[status.value] || 0;
            return (
              <option key={status.value} value={status.value}>
                {status.label} {count > 0 ? `(${count})` : ""}
              </option>
            );
          })}
        </Select>
      </Box>
      {organisationUnits.length > 0 && (
        <Box style={{ minWidth: "200px" }}>
          <Select
            label="Skole"
            size="small"
            value={schoolSelection || ""}
            onChange={(e) => onSchoolSelectionChange(e.target.value)}
          >
            <option value="">Alle skoler</option>
            {organisationUnits.map((unit) => (
              <option
                key={unit.organisationNumber}
                value={unit.organisationNumber}
              >
                {unit.name}
              </option>
            ))}
          </Select>
        </Box>
      )}
    </HStack>
  );
}
