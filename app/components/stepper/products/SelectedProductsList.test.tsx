import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SelectedProductsList } from "./SelectedProductsList";

vi.mock("@navikt/ds-react", () => {
  const Box = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Detail = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
  const Heading = ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>;
  const VStack = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const List = ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>;
  List.Item = ({
    children,
    onClick,
    title,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    title?: string;
  }) => (
    <li>
      <button type="button" onClick={onClick}>
        {title}
      </button>
      <span>{children}</span>
    </li>
  );
  return { Box, Detail, Heading, List, VStack };
});

describe("SelectedProductsList", () => {
  it("shows empty state text when no products are selected", () => {
    render(<SelectedProductsList selectedProducts={[]} onRemoveProduct={vi.fn()} />);
    expect(screen.getByText("Ingen produkter valgt ennå. Velg produkter fra listen under.")).toBeTruthy();
  });

  it("renders selected product and removes on click", () => {
    const onRemoveProduct = vi.fn();
    const selected = {
      itemCode: "A1",
      description: "Produkt A",
      quantity: 2,
      itemPrice: 1299,
      customPrice: 1599,
      taxrate: null,
      uri: "",
    };
    render(
      <SelectedProductsList
        selectedProducts={[selected]}
        onRemoveProduct={onRemoveProduct}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Produkt A (A1)" }));
    expect(onRemoveProduct).toHaveBeenCalledWith(selected);
  });
});
