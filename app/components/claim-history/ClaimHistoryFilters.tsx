import {Box, HStack, Select, UNSAFE_Combobox} from "@navikt/ds-react";
import React, {useMemo} from "react";
import {ORDER_STATUS_LIST} from "./ClaimStatusConfig";

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
      return;
    }

    let newStatuses: string[];
    if (isSelected) {
      newStatuses = [...selectedStatuses, option.toUpperCase()];
    } else {
      newStatuses = selectedStatuses.filter((s) => s !== option.toUpperCase());
    }

    if (newStatuses.length === 0) {
      onStatusFilterChange("all");
    } else {
      onStatusFilterChange(newStatuses.join(","));
    }
  };

  return (
    <HStack gap="space-8" wrap align="end">
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
