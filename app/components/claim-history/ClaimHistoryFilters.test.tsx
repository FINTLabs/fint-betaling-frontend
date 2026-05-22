import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ClaimHistoryFilters } from "./ClaimHistoryFilters";

vi.mock("@navikt/ds-react", () => {
  const Box = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const HStack = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Select = ({
    label,
    value,
    onChange,
    children,
  }: {
    label: string;
    value?: string;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
    children: React.ReactNode;
  }) => (
    <label>
      {label}
      <select
        aria-label={label}
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
    </label>
  );

  const UNSAFE_Combobox = ({
    options,
    selectedOptions,
    onToggleSelected,
  }: {
    options: string[];
    selectedOptions: string[];
    onToggleSelected: (
      option: string,
      isSelected: boolean,
      isCustomOption: boolean,
    ) => void;
  }) => (
    <div>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          data-testid={`toggle-${option}`}
          onClick={() =>
            onToggleSelected(
              option,
              !selectedOptions.includes(option),
              false,
            )
          }
        >
          {option}
        </button>
      ))}
      <button
        type="button"
        data-testid="toggle-custom"
        onClick={() => onToggleSelected("custom", true, true)}
      >
        custom
      </button>
    </div>
  );

  return { Box, HStack, Select, UNSAFE_Combobox };
});

describe("ClaimHistoryFilters", () => {
  it("calls date filter callback when date changes", () => {
    const onDateFilterChange = vi.fn();
    render(
      <ClaimHistoryFilters
        dateFilter="ALL"
        onDateFilterChange={onDateFilterChange}
        onStatusFilterChange={vi.fn()}
        onSchoolSelectionChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Dato"), {
      target: { value: "MONTH" },
    });
    expect(onDateFilterChange).toHaveBeenCalledWith("MONTH");
  });

  it("renders school select when organisation units are available", () => {
    const onSchoolSelectionChange = vi.fn();
    render(
      <ClaimHistoryFilters
        schoolSelection=""
        organisationUnits={[{ organisationNumber: "123", name: "Skole A" }]}
        onDateFilterChange={vi.fn()}
        onStatusFilterChange={vi.fn()}
        onSchoolSelectionChange={onSchoolSelectionChange}
      />,
    );

    fireEvent.change(screen.getByLabelText("Skole"), {
      target: { value: "123" },
    });
    expect(onSchoolSelectionChange).toHaveBeenCalledWith("123");
  });

  it("toggles status selections and falls back to all", () => {
    const onStatusFilterChange = vi.fn();
    const { rerender } = render(
      <ClaimHistoryFilters
        statusFilter="all"
        onDateFilterChange={vi.fn()}
        onStatusFilterChange={onStatusFilterChange}
        onSchoolSelectionChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId("toggle-STORED"));
    expect(onStatusFilterChange).toHaveBeenCalledWith("STORED");

    rerender(
      <ClaimHistoryFilters
        statusFilter="STORED"
        onDateFilterChange={vi.fn()}
        onStatusFilterChange={onStatusFilterChange}
        onSchoolSelectionChange={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId("toggle-STORED"));
    expect(onStatusFilterChange).toHaveBeenCalledWith("all");
  });

  it("ignores custom combobox options", () => {
    const onStatusFilterChange = vi.fn();
    render(
      <ClaimHistoryFilters
        statusFilter="all"
        onDateFilterChange={vi.fn()}
        onStatusFilterChange={onStatusFilterChange}
        onSchoolSelectionChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId("toggle-custom"));
    expect(onStatusFilterChange).not.toHaveBeenCalled();
  });
});
