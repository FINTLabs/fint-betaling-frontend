import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SaveStep } from "./SaveStep";

const mocks = vi.hoisted(() => ({
  trackButtonClick: vi.fn(),
  capturedOnNext: undefined as (() => void) | undefined,
}));

vi.mock("~/api/AnalyticsApi", () => ({
  default: {
    trackButtonClick: mocks.trackButtonClick,
  },
}));

vi.mock("~/utils/variousFormats", () => ({
  formatCurrency: (value: number) => `currency-${value}`,
  formatPrice: (value: number) => `price-${value}`,
}));

vi.mock("./StepNavigation", () => ({
  StepNavigation: ({ onNext }: { onNext: () => void }) => {
    mocks.capturedOnNext = onNext;
    return (
      <button type="button" onClick={onNext}>
        mock-next
      </button>
    );
  },
}));

vi.mock("@navikt/ds-react", () => {
  const Box = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const VStack = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const FormSummary = ({ children }: { children: React.ReactNode }) => (
    <section>{children}</section>
  );
  FormSummary.Header = ({ children }: { children: React.ReactNode }) => (
    <header>{children}</header>
  );
  FormSummary.Heading = ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>;
  FormSummary.Answers = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  FormSummary.Answer = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  FormSummary.Label = ({ children }: { children: React.ReactNode }) => <strong>{children}</strong>;
  FormSummary.Value = ({ children }: { children: React.ReactNode }) => <span>{children}</span>;
  FormSummary.Footer = ({ children }: { children: React.ReactNode }) => <footer>{children}</footer>;

  return { Box, FormSummary, VStack };
});

describe("SaveStep", () => {
  it("renders selected recipients and products summary", () => {
    render(
      <SaveStep
        selectedRecipients={[{ id: "1", name: "Ada Lovelace" }]}
        selectedProducts={[
          {
            itemCode: "P1",
            description: "Produkt A",
            quantity: 2,
            itemPrice: 1500,
            taxrate: null,
            uri: "",
            freeText: "Kommentar",
          },
        ]}
        onSendToFactoring={vi.fn()}
      />,
    );

    expect(screen.getByText("Ada Lovelace")).toBeTruthy();
    expect(screen.getByText("Produkt A")).toBeTruthy();
    expect(screen.getByText("price-3000")).toBeTruthy();
  });

  it("tracks analytics and sends SAVE_INVOICES form action", () => {
    const onSendToFactoring = vi.fn();
    render(
      <SaveStep
        selectedRecipients={[]}
        selectedProducts={[]}
        onSendToFactoring={onSendToFactoring}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "mock-next" }));

    expect(mocks.trackButtonClick).toHaveBeenCalled();
    const formData = onSendToFactoring.mock.calls[0]?.[0] as FormData;
    expect(formData.get("actionType")).toBe("SAVE_INVOICES");
  });
});
