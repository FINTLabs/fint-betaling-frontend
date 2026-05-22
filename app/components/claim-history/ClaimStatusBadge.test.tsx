import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ClaimStatusBadge } from "./ClaimStatusBadge";

vi.mock("@navikt/ds-react", () => {
  const Tag = ({
    children,
    onClick,
    onKeyDown,
    role,
    tabIndex,
    "aria-label": ariaLabel,
    "aria-expanded": ariaExpanded,
  }: Record<string, unknown>) => (
    <span
      role={role as string | undefined}
      tabIndex={tabIndex as number | undefined}
      aria-label={ariaLabel as string | undefined}
      aria-expanded={ariaExpanded as boolean | undefined}
      onClick={onClick as React.MouseEventHandler}
      onKeyDown={onKeyDown as React.KeyboardEventHandler}
    >
      {children as React.ReactNode}
    </span>
  );

  const Popover = ({
    open,
    children,
  }: {
    open?: boolean;
    children: React.ReactNode;
  }) => (open ? <div data-testid="popover">{children}</div> : null);

  Popover.Content = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );

  return { Tag, Popover };
});

describe("ClaimStatusBadge", () => {
  it("renders label and click affordance when message exists", () => {
    render(<ClaimStatusBadge claimStatus="PAID" statusMessage="done" />);

    expect(screen.getByText("Betalt")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Betalt/ })).toBeTruthy();
  });

  it("invokes onClick callback with message and normalized status", () => {
    const onClick = vi.fn();
    render(
      <ClaimStatusBadge
        claimStatus="stored"
        statusMessage="json"
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Ikke sendt/ }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[1]).toBe("json");
    expect(onClick.mock.calls[0]?.[2]).toBe("STORED");
  });

  it("toggles popover with parsed status message", () => {
    render(
      <ClaimStatusBadge
        claimStatus="ERROR"
        statusMessage='{"message":"Teknisk feil"}'
      />,
    );

    const badge = screen.getByRole("button", { name: /Generell feil/ });
    fireEvent.click(badge);
    expect(screen.getByTestId("popover").textContent).toContain("Teknisk feil");

    fireEvent.click(badge);
    expect(screen.queryByTestId("popover")).toBeNull();
  });
});
