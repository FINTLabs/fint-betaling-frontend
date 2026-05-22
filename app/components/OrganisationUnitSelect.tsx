import {Box, Select} from "@navikt/ds-react";
import type { IOrganisationUnit } from "~/types/user";
import type { ChangeEvent } from "react";
import { useSubmit } from "react-router";

interface OrganisationUnitSelectProps {
  organisationUnits: IOrganisationUnit[];
  value?: IOrganisationUnit; // organisationNumber of selected unit
}

export function OrganisationUnitSelect({
  organisationUnits,
  value,
}: OrganisationUnitSelectProps) {
  const submit = useSubmit();

  const handleOrgChange = (event: ChangeEvent<HTMLSelectElement>) => {
    // setOrgName(event.target.value);

    submit(
      {
        selectedOrganization: event.target.value,
        actionType: "UPDATE_SELECTED_ORGANIZATION",
      },
      {
        method: "POST",
        navigate: false,
      },
    );
  };

  return (
      <Box margin={"space-6"}>
    <Select
      label={"Velg organisasjonsenhet"}
      value={value?.organisationNumber || ""}
      onChange={handleOrgChange}
      size={"small"}
      disabled={false}
      hideLabel
      className={"pr-10"}
    >
      {organisationUnits.map((unit) => (
        <option key={unit.organisationNumber} value={unit.organisationNumber}>
          {unit.name}
        </option>
      ))}
    </Select>
        </Box>
  );
}
