import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GroupRecipientsTable } from "./GroupRecipientsTable";

vi.mock("@navikt/ds-react", () => {
  const Box = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Checkbox = ({
    children,
    checked,
    onChange,
  }: {
    children: React.ReactNode;
    checked?: boolean;
    onChange?: () => void;
  }) => (
    <label>
      <input type="checkbox" checked={Boolean(checked)} onChange={onChange} />
      {children}
    </label>
  );
  const CheckboxGroup = ({
    onChange,
    children,
  }: {
    onChange: (value: string[]) => void;
    children: React.ReactNode;
  }) => (
    <div>
      {children}
      <button type="button" onClick={() => onChange(["c1"])}>
        apply-group-selection
      </button>
    </div>
  );
  const Table = ({ children }: { children: React.ReactNode }) => <table>{children}</table>;
  Table.Header = ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>;
  Table.Body = ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>;
  Table.Row = ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>;
  Table.HeaderCell = ({ children }: { children: React.ReactNode }) => <th>{children}</th>;
  Table.DataCell = ({ children }: { children: React.ReactNode }) => <td>{children}</td>;
  Table.ExpandableRow = ({
    children,
    content,
  }: {
    children: React.ReactNode;
    content: React.ReactNode;
  }) => (
    <>
      <tr>{children}</tr>
      <tr>
        <td>{content}</td>
      </tr>
    </>
  );
  return { Box, Checkbox, CheckboxGroup, Table };
});

describe("GroupRecipientsTable", () => {
  it("toggles group and individual recipients", () => {
    const onToggleRecipient = vi.fn();
    const onToggleGroup = vi.fn();
    const customer = { id: "c1", name: "Ada" };
    const group = { name: "1A", description: "Klasse", customers: [customer] };

    render(
      <GroupRecipientsTable
        groups={[group]}
        selectedRecipients={[]}
        onToggleRecipient={onToggleRecipient}
        onToggleGroup={onToggleGroup}
      />,
    );

    fireEvent.click(screen.getByLabelText("Velg 1A"));
    fireEvent.click(screen.getByRole("button", { name: "apply-group-selection" }));

    expect(onToggleGroup).toHaveBeenCalledWith(group, true);
    expect(onToggleRecipient).toHaveBeenCalledWith(customer, true);
  });
});
