import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SelectedRecipientsList } from "./SelectedRecipientsList";

vi.mock("@navikt/ds-react", () => {
  const Box = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Detail = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
  const Heading = ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>;
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
        remove
      </button>
      <span>{children}</span>
    </li>
  );
  const ExpansionCard = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  ExpansionCard.Header = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  ExpansionCard.Title = ({ children }: { children: React.ReactNode }) => <h5>{children}</h5>;
  ExpansionCard.Description = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
  ExpansionCard.Content = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  return { Box, Detail, ExpansionCard, Heading, List };
});

describe("SelectedRecipientsList", () => {
  it("shows empty message", () => {
    render(
      <SelectedRecipientsList
        selectedRecipients={[]}
        onRemoveRecipient={vi.fn()}
      />,
    );
    expect(screen.getByText("Ingen mottakere valgt")).toBeTruthy();
  });

  it("removes recipient when remove button is enabled", () => {
    const onRemoveRecipient = vi.fn();
    const person = { id: "1", name: "Ada" };
    render(
      <SelectedRecipientsList
        selectedRecipients={[person]}
        onRemoveRecipient={onRemoveRecipient}
        showRemoveButton
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "remove" }));
    expect(onRemoveRecipient).toHaveBeenCalledWith(person);
  });
});
