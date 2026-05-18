import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductsTable } from "./ProductsTable";

vi.mock("~/utils/variousFormats", () => ({
  formatCurrency: (value: number) => `currency-${value}`,
}));

vi.mock("@navikt/ds-react", () => {
  const Box = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Heading = ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>;
  const HStack = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const VStack = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Search = ({
    label,
    onChange,
  }: {
    label: string;
    onChange: (value: string) => void;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
      />
    </label>
  );
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
  const TextField = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
  }) => (
    <label>
      {label}
      <input aria-label={label} value={value} onChange={onChange} />
    </label>
  );
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
  return { Box, Checkbox, Heading, HStack, Search, Table, TextField, VStack };
});

const product = {
  itemCode: "P1",
  itemPrice: 1299,
  taxrate: 250,
  description: "Produkt A",
  uri: "",
};

describe("ProductsTable", () => {
  it("shows empty search result text", () => {
    render(
      <ProductsTable
        products={[]}
        selectedProducts={[]}
        onToggleProduct={vi.fn()}
        onQuantityChange={vi.fn()}
        onPriceChange={vi.fn()}
        onFreeTextChange={vi.fn()}
        searchQuery="abc"
        onSearchChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Ingen resultater funnet for søket ditt")).toBeTruthy();
  });

  it("forwards search changes and toggle callback", () => {
    const onSearchChange = vi.fn();
    const onToggleProduct = vi.fn();
    render(
      <ProductsTable
        products={[product]}
        selectedProducts={[]}
        onToggleProduct={onToggleProduct}
        onQuantityChange={vi.fn()}
        onPriceChange={vi.fn()}
        onFreeTextChange={vi.fn()}
        searchQuery=""
        onSearchChange={onSearchChange}
      />,
    );

    fireEvent.change(screen.getByLabelText("Søk på produktnavn eller produktkode"), {
      target: { value: "matte" },
    });
    fireEvent.click(screen.getByLabelText("Velg Produkt A"));

    expect(onSearchChange).toHaveBeenCalledWith("matte");
    expect(onToggleProduct).toHaveBeenCalledWith(product, true);
  });

  it("updates selected product fields through callbacks", () => {
    const selectedProduct = {
      ...product,
      quantity: 2,
      customPrice: 1599,
      freeText: "memo",
    };
    const onQuantityChange = vi.fn();
    const onPriceChange = vi.fn();
    const onFreeTextChange = vi.fn();

    render(
      <ProductsTable
        products={[product]}
        selectedProducts={[selectedProduct]}
        onToggleProduct={vi.fn()}
        onQuantityChange={onQuantityChange}
        onPriceChange={onPriceChange}
        onFreeTextChange={onFreeTextChange}
        searchQuery=""
        onSearchChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Fritekst"), { target: { value: "ny tekst" } });
    fireEvent.change(screen.getByLabelText("Kroner"), { target: { value: "20" } });
    fireEvent.change(screen.getByLabelText("Øre"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("Antall"), { target: { value: "3" } });

    expect(onFreeTextChange).toHaveBeenCalledWith(product, "ny tekst");
    expect(onPriceChange).toHaveBeenCalledWith(product, 2099);
    expect(onPriceChange).toHaveBeenCalledWith(product, 1505);
    expect(onQuantityChange).toHaveBeenCalledWith(product, 3);
  });
});
