import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StepNavigation } from "./StepNavigation";

vi.mock("@navikt/ds-react", () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  HStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({
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
  ),
}));

describe("StepNavigation", () => {
  it("renders next button and triggers onNext", () => {
    const onNext = vi.fn();
    render(<StepNavigation onNext={onNext} />);

    fireEvent.click(screen.getByRole("button", { name: "Videre" }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("renders previous button when callback is provided", () => {
    const onPrevious = vi.fn();
    render(<StepNavigation onNext={vi.fn()} onPrevious={onPrevious} />);

    fireEvent.click(screen.getByRole("button", { name: "Tilbake" }));
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it("disables next button when disabled prop is set", () => {
    render(<StepNavigation onNext={vi.fn()} disabled nextButtonText="Fortsett" />);

    const nextButton = screen.getByRole("button", { name: "Fortsett" });
    expect((nextButton as HTMLButtonElement).disabled).toBe(true);
  });
});
