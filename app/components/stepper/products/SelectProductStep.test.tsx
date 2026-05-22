import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SelectProductStep } from "./SelectProductStep";

const sampleProduct = {
  itemCode: "P1",
  itemPrice: 1000,
  taxrate: null,
  description: "Produkt A",
  uri: "",
};

vi.mock("~/utils/variousFormats", () => ({
  formatPrice: (value: number) => `price-${value}`,
}));

vi.mock("~/components/SelectAndPaging", () => ({
  SelectAndPaging: ({ totalOrders }: { totalOrders: number }) => (
    <div>paging-{totalOrders}</div>
  ),
}));

vi.mock("./ProductsTable", () => ({
  ProductsTable: (props: {
    onToggleProduct: (product: typeof sampleProduct, checked: boolean) => void;
    onQuantityChange: (product: typeof sampleProduct, quantity: number) => void;
    onPriceChange: (product: typeof sampleProduct, price: number) => void;
    onFreeTextChange: (product: typeof sampleProduct, value: string) => void;
    onSearchChange: (query: string) => void;
  }) => (
    <div>
      <button type="button" onClick={() => props.onToggleProduct(sampleProduct, true)}>
        toggle-product
      </button>
      <button type="button" onClick={() => props.onQuantityChange(sampleProduct, 3)}>
        change-qty
      </button>
      <button type="button" onClick={() => props.onPriceChange(sampleProduct, 1900)}>
        change-price
      </button>
      <button
        type="button"
        onClick={() => props.onFreeTextChange(sampleProduct, "tekst")}
      >
        change-text
      </button>
      <button type="button" onClick={() => props.onSearchChange("abc")}>
        change-search
      </button>
    </div>
  ),
}));

vi.mock("../StepNavigation", () => ({
  StepNavigation: ({
    disabled,
  }: {
    disabled?: boolean;
  }) => <div>{disabled ? "next-disabled" : "next-enabled"}</div>,
}));

vi.mock("~/components/stepper/recipients/SelectedRecipientsModal", () => ({
  default: () => <div>recipients-modal</div>,
}));

vi.mock("~/components/stepper/products/SelectedProductsModal", () => ({
  default: (props: { onRemoveProduct: (product: typeof sampleProduct) => void }) => (
    <button type="button" onClick={() => props.onRemoveProduct(sampleProduct)}>
      remove-product
    </button>
  ),
}));

vi.mock("@navikt/ds-react", () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Detail: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  Heading: ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>,
  HStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  VStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("SelectProductStep", () => {
  it("shows disabled next state when no products are selected", () => {
    render(
      <SelectProductStep
        selectedRecipients={[]}
        products={[sampleProduct]}
        selectedProducts={[]}
        setSelectedProducts={vi.fn()}
        onNext={vi.fn()}
      />,
    );

    expect(screen.getByText("next-disabled")).toBeTruthy();
  });

  it("updates selected products via setter callbacks", () => {
    const setSelectedProducts = vi.fn();
    render(
      <SelectProductStep
        selectedRecipients={[]}
        products={[sampleProduct]}
        selectedProducts={[{ ...sampleProduct, quantity: 1 }]}
        setSelectedProducts={setSelectedProducts}
        onNext={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "toggle-product" }));
    fireEvent.click(screen.getByRole("button", { name: "change-qty" }));
    fireEvent.click(screen.getByRole("button", { name: "change-price" }));
    fireEvent.click(screen.getByRole("button", { name: "change-text" }));
    fireEvent.click(screen.getByRole("button", { name: "remove-product" }));

    expect(setSelectedProducts).toHaveBeenCalled();
    const addFn = setSelectedProducts.mock.calls[0]?.[0] as (
      prev: typeof sampleProduct[],
    ) => unknown;
    const added = addFn([]);
    expect(Array.isArray(added)).toBe(true);
  });
});
