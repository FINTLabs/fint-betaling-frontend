import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SelectedRecipientsModal } from "./SelectedRecipientsModal";

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
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <li>
      <button type="button" onClick={onClick}>
        remove-recipient
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

describe("SelectedRecipientsModal", () => {
  it("disables opener when no recipients are selected", () => {
    render(<SelectedRecipientsModal selectedRecipients={[]} />);
    const button = screen.getByRole("button", { name: "0 mottakere valgt" });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it("opens modal and triggers recipient removal when enabled", () => {
    const onRemoveRecipient = vi.fn();
    const person = { id: "1", name: "Ada" };
    render(
      <SelectedRecipientsModal
        selectedRecipients={[person]}
        onRemoveRecipient={onRemoveRecipient}
        showRemoveButton
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "1 mottaker valgt" }));
    fireEvent.click(screen.getByRole("button", { name: "remove-recipient" }));
    expect(onRemoveRecipient).toHaveBeenCalledWith(person);
  });
});
