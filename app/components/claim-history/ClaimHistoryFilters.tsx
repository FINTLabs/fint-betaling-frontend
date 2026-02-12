import { Box, Select, HStack, UNSAFE_Combobox } from "@navikt/ds-react";
import { useMemo } from "react";
import { ORDER_STATUS_LIST } from "./ClaimStatusConfig";

interface OrderHistoryFiltersProps {
  dateFilter?: string;
  statusFilter?: string;
  schoolSelection?: string;
  organisationUnits?: Array<{ organisationNumber: string; name: string }>;
  onDateFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSchoolSelectionChange: (value: string) => void;
}

export function ClaimHistoryFilters({
  dateFilter,
  statusFilter,
  schoolSelection,
  organisationUnits = [],
  onDateFilterChange,
  onStatusFilterChange,
  onSchoolSelectionChange,
}: OrderHistoryFiltersProps) {
  // Parse comma-separated status string to array, or empty array if "all" or empty
  const selectedStatuses = useMemo(() => {
    if (!statusFilter || statusFilter === "all" || statusFilter === "ALL") {
      return [];
    }
    return statusFilter.split(",").map((s) => s.trim().toUpperCase());
  }, [statusFilter]);

  // Create options as strings (required for multi-select)
  const statusOptionValues = useMemo(() => {
    return ORDER_STATUS_LIST.map((status) => status.value);
  }, []);

  //TODO: custom option is in nav
  const handleStatusToggle = (
    option: string,
    isSelected: boolean,
    isCustomOption: boolean,
  ) => {
    if (isCustomOption) {
      // Don't allow custom options for status
      return;
    }

    let newStatuses: string[];
    if (isSelected) {
      // Add status
      newStatuses = [...selectedStatuses, option.toUpperCase()];
    } else {
      // Remove status
      newStatuses = selectedStatuses.filter((s) => s !== option.toUpperCase());
    }

    // Convert array to comma-separated string or "all" if empty
    if (newStatuses.length === 0) {
      onStatusFilterChange("all");
    } else {
      onStatusFilterChange(newStatuses.join(","));
    }
  };

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
      <Box style={{ minWidth: "300px" }}>
        <UNSAFE_Combobox
          size="small"
          label="Status"
          isMultiSelect
          options={statusOptionValues}
          selectedOptions={selectedStatuses}
          onToggleSelected={handleStatusToggle}
          shouldShowSelectedOptions={true}
        />
      </Box>
    </HStack>
  );
}
