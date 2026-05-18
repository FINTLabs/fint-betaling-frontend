import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecipientTypeSelector } from "./RecipientTypeSelector";

vi.mock("@navikt/ds-react", () => {
  const Box = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Stack = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Search = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value?: string;
    onChange: (value: string) => void;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
      />
    </label>
  );
  const Radio = ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  );
  const RadioGroup = ({
    onChange,
    children,
  }: {
    onChange: (value: string) => void;
    children: React.ReactNode;
  }) => (
    <div>
      {children}
      <button type="button" aria-label="Mottakertype" onClick={() => onChange("person")}>
        choose-person
      </button>
    </div>
  );
  return { Box, Radio, RadioGroup, Search, Stack };
});

describe("RecipientTypeSelector", () => {
  it("updates search query", () => {
    const onSearchChange = vi.fn();
    render(
      <RecipientTypeSelector
        recipientType="gruppe"
        onRecipientTypeChange={vi.fn()}
        searchQuery=""
        onSearchChange={onSearchChange}
      />,
    );

    fireEvent.change(screen.getByLabelText("Søk på gruppenavn"), {
      target: { value: "1A" },
    });
    expect(onSearchChange).toHaveBeenCalledWith("1A");
  });

  it("updates recipient type", () => {
    const onRecipientTypeChange = vi.fn();
    render(
      <RecipientTypeSelector
        recipientType="gruppe"
        onRecipientTypeChange={onRecipientTypeChange}
        searchQuery=""
        onSearchChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByLabelText("Mottakertype"));
    expect(onRecipientTypeChange).toHaveBeenCalledWith("person");
  });
});
