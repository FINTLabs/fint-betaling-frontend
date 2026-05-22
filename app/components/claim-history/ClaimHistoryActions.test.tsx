import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ClaimHistoryActions } from "./ClaimHistoryActions";

const mocks = vi.hoisted(() => ({
  exportClaimsToCsvMock: vi.fn(),
}));

vi.mock("~/utils/exportClaimsToCsv", () => ({
  exportClaimsToCsv: mocks.exportClaimsToCsvMock,
}));

vi.mock("@navikt/ds-react", () => ({
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

describe("ClaimHistoryActions", () => {
  it("disables resend button when no claims are selected", () => {
    render(
      <ClaimHistoryActions selectedCount={0} onResend={vi.fn()} claims={[]} />,
    );

    const resendButton = screen.getByRole("button", { name: "RESEND" });
    expect((resendButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("calls onResend when resend button is clicked", () => {
    const onResend = vi.fn();
    render(
      <ClaimHistoryActions selectedCount={1} onResend={onResend} claims={[]} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "RESEND" }));
    expect(onResend).toHaveBeenCalledTimes(1);
  });

  it("exports visible claims to CSV", () => {
    const claims = [{ orderNumber: 101 }, { orderNumber: 102 }] as never[];
    render(
      <ClaimHistoryActions selectedCount={1} onResend={vi.fn()} claims={claims} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "EKSPORTER" }));
    expect(mocks.exportClaimsToCsvMock).toHaveBeenCalledWith(claims);
  });
});
