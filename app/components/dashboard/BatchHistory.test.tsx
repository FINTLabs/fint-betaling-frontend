import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BatchHistory } from "./BatchHistory";

vi.mock("~/utils/variousFormats", () => ({
  formatDate: (value: string) => `formatted-${value}`,
}));

vi.mock("@navikt/ds-react", () => {
  const Box = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Heading = ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>;
  const VStack = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

  const Table = ({ children }: { children: React.ReactNode }) => (
    <table>{children}</table>
  );
  Table.Header = ({ children }: { children: React.ReactNode }) => (
    <thead>{children}</thead>
  );
  Table.Body = ({ children }: { children: React.ReactNode }) => (
    <tbody>{children}</tbody>
  );
  Table.Row = ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>;
  Table.HeaderCell = ({ children }: { children: React.ReactNode }) => (
    <th>{children}</th>
  );
  Table.DataCell = ({ children }: { children: React.ReactNode }) => (
    <td>{children}</td>
  );

  return { Box, Heading, Table, VStack };
});

describe("BatchHistory", () => {
  it("shows empty message when there are no batches", () => {
    render(<BatchHistory batches={[]} />);

    expect(screen.getByText("Ingen ordrer funnet de siste 14 dagene")).toBeTruthy();
  });

  it("renders formatted batches and highlights errors", () => {
    render(
      <BatchHistory
        batches={[
          {
            date: "2024-05-01T10:00:00Z",
            totalRecords: 12,
            sent: 8,
            errors: 2,
            stored: 1,
            cancelled: 1,
          },
          {
            date: "2024-05-02T10:00:00Z",
            totalRecords: 3,
            sent: 3,
            errors: 0,
            stored: 0,
            cancelled: 0,
          },
        ]}
      />,
    );

    expect(screen.getByText("formatted-2024-05-01T10:00:00Z")).toBeTruthy();
    expect(screen.getByText("formatted-2024-05-02T10:00:00Z")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("8")).toBeTruthy();
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("2").tagName).toBe("SPAN");
  });
});
