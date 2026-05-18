import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PersonRecipientsTable } from "./PersonRecipientsTable";

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
  const Table = ({ children }: { children: React.ReactNode }) => <table>{children}</table>;
  Table.Header = ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>;
  Table.Body = ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>;
  Table.Row = ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>;
  Table.HeaderCell = ({ children }: { children: React.ReactNode }) => <th>{children}</th>;
  Table.DataCell = ({ children }: { children: React.ReactNode }) => <td>{children}</td>;
  return { Box, Checkbox, Table };
});

describe("PersonRecipientsTable", () => {
  it("toggles selected person", () => {
    const onToggleRecipient = vi.fn();
    const customer = { id: "1", name: "Ada" };
    render(
      <PersonRecipientsTable
        customers={[customer]}
        selectedRecipients={[]}
        onToggleRecipient={onToggleRecipient}
      />,
    );

    fireEvent.click(screen.getByLabelText("Velg Ada"));
    expect(onToggleRecipient).toHaveBeenCalledWith(customer, true);
  });
});
