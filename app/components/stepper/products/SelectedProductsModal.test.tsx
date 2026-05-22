import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SelectedProductsModal } from "./SelectedProductsModal";

vi.mock("~/utils/variousFormats", () => ({
  formatPrice: (value: number) => `price-${value}`,
}));

vi.mock("@navikt/ds-react", () => {
  const Button = ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
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
  const Modal = ({
    open,
    children,
  }: {
    open?: boolean;
    children: React.ReactNode;
  }) => (open ? <div>{children}</div> : null);
  Modal.Body = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  return { List, Modal, Button };
});

describe("SelectedProductsModal", () => {
  it("disables opener button when no products are selected", () => {
    render(<SelectedProductsModal selectedProducts={[]} />);
    const button = screen.getByRole("button", { name: /0 produkter? valgt/ });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it("opens modal and removes product when configured", () => {
    const onRemoveProduct = vi.fn();
    const product = {
      itemCode: "A1",
      description: "Produkt A",
      quantity: 3,
      itemPrice: 1000,
      taxrate: null,
      uri: "",
    };
    render(
      <SelectedProductsModal
        selectedProducts={[product]}
        onRemoveProduct={onRemoveProduct}
        showRemoveButton
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "1 produkt valgt" }));
    fireEvent.click(screen.getByRole("button", { name: "Produkt A (A1)" }));
    expect(onRemoveProduct).toHaveBeenCalledWith(product);
    expect(screen.getByText(/Pris pr. enhet: price-1000/)).toBeTruthy();
  });
});
