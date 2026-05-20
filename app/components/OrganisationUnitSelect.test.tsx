import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { OrganisationUnitSelect } from "./OrganisationUnitSelect";

const mocks = vi.hoisted(() => ({
  submit: vi.fn(),
}));

vi.mock("react-router", () => ({
  useSubmit: () => mocks.submit,
}));

vi.mock("@navikt/ds-react", () => ({
  Box: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Select: ({
    label,
    value,
    onChange,
    children,
    className,
  }: React.PropsWithChildren<{
    label?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    className?: string;
  }>) => (
    <select
      aria-label={typeof label === "string" ? label : "organisation-select"}
      value={value ?? ""}
      onChange={onChange}
      className={className}
    >
      {children}
    </select>
  ),
}));

const units = [
  { organisationNumber: "111", name: "School A" },
  { organisationNumber: "222", name: "School B" },
];

describe("OrganisationUnitSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists every organisation unit as an option", () => {
    render(<OrganisationUnitSelect organisationUnits={units} />);

    const optA = screen.getByRole("option", { name: "School A" });
    const optB = screen.getByRole("option", { name: "School B" });
    expect(optA.getAttribute("value")).toBe("111");
    expect(optB.getAttribute("value")).toBe("222");
  });

  it("shows the selected organisation number when value is set", () => {
    render(
      <OrganisationUnitSelect
        organisationUnits={units}
        value={units[1]}
      />,
    );

    const select = screen.getByRole("combobox", {
      name: "Velg organisasjonsenhet",
    });
    expect((select as HTMLSelectElement).value).toBe("222");
  });

  it("submits UPDATE_SELECTED_ORGANIZATION with no navigation on change", () => {
    render(
      <OrganisationUnitSelect organisationUnits={units} value={units[0]} />,
    );

    const select = screen.getByRole("combobox", {
      name: "Velg organisasjonsenhet",
    });
    fireEvent.change(select, { target: { value: "222" } });

    expect(mocks.submit).toHaveBeenCalledTimes(1);
    expect(mocks.submit).toHaveBeenCalledWith(
      {
        selectedOrganization: "222",
        actionType: "UPDATE_SELECTED_ORGANIZATION",
      },
      { method: "POST", navigate: false },
    );
  });

  it("when value is omitted the native select falls back to the first organisation", () => {
    render(<OrganisationUnitSelect organisationUnits={units} />);
    const select = screen.getByRole("combobox", {
      name: "Velg organisasjonsenhet",
    }) as HTMLSelectElement;
    // Controlled value="" matches no option; browsers typically expose the first option as selectedIndex 0.
    expect(select.selectedIndex).toBe(0);
    expect(select.options[select.selectedIndex]?.value).toBe("111");
  });
});
