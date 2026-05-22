import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SelectAndPaging } from "./SelectAndPaging";

vi.mock("@navikt/ds-react", () => ({
  Detail: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  HStack: ({ children }: React.PropsWithChildren) => (
    <div data-testid="stack">{children}</div>
  ),
  Select: ({
    label,
    value,
    onChange,
    children,
  }: React.PropsWithChildren<{
    label?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  }>) => (
    <select
      aria-label={label ?? "rows-per-page"}
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  ),
  Pagination: ({
    page,
    count,
    onPageChange,
  }: {
    page: number;
    count: number;
    onPageChange: (next: number) => void;
  }) => (
    <div data-testid="pagination-controls">
      <button
        type="button"
        aria-label="Go to previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      <button
        type="button"
        aria-label="Go to next page"
        disabled={page >= count}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
      <span data-testid="page-indicator">
        page {page} of {count}
      </span>
    </div>
  ),
}));

describe("SelectAndPaging", () => {
  const onPageChange = vi.fn();
  const onRowsPerPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows row range summary for middle page", () => {
    render(
      <SelectAndPaging
        page={2}
        totalPages={3}
        rowsPerPage={25}
        totalOrders={55}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />,
    );

    expect(screen.getByText("26-50 of 55")).toBeTruthy();
  });

  it("shows rows-per-page summary on first partial page", () => {
    render(
      <SelectAndPaging
        page={1}
        totalPages={1}
        rowsPerPage={50}
        totalOrders={12}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />,
    );

    expect(screen.getByText("1-12 of 12")).toBeTruthy();
  });

  it("reflects rowsPerPage value in select", () => {
    render(
      <SelectAndPaging
        page={1}
        totalPages={2}
        rowsPerPage={100}
        totalOrders={80}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />,
    );

    const select = screen.getByRole("combobox", {
      name: "Rows per page",
    }) as HTMLSelectElement;
    expect(select.value).toBe("100");
  });

  it("calls onRowsPerPageChange and resets page to 1 when rows change", () => {
    render(
      <SelectAndPaging
        page={3}
        totalPages={5}
        rowsPerPage={25}
        totalOrders={100}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />,
    );

    const select = screen.getByRole("combobox", { name: "Rows per page" });
    fireEvent.change(select, { target: { value: "50" } });

    expect(onRowsPerPageChange).toHaveBeenCalledExactlyOnceWith(50);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("invokes pagination callback from mocked controls", () => {
    render(
      <SelectAndPaging
        page={2}
        totalPages={5}
        rowsPerPage={25}
        totalOrders={100}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /next page/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole("button", { name: /previous page/i }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
  });
});
