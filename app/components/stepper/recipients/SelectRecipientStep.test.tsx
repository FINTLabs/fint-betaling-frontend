import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SelectRecipientStep } from "./SelectRecipientStep";

const mocks = vi.hoisted(() => ({
  sendFile: vi.fn(),
}));

vi.mock("~/api/FileApi", () => ({
  default: {
    sendFile: mocks.sendFile,
  },
}));

vi.mock("~/components/SelectAndPaging", () => ({
  SelectAndPaging: ({ totalOrders }: { totalOrders: number }) => (
    <div>paging-{totalOrders}</div>
  ),
}));

vi.mock("./RecipientTypeSelector", () => ({
  RecipientTypeSelector: (props: {
    onRecipientTypeChange: (value: "gruppe" | "person") => void;
    onSearchChange: (query: string) => void;
  }) => (
    <div>
      <button type="button" onClick={() => props.onRecipientTypeChange("person")}>
        switch-person
      </button>
      <button type="button" onClick={() => props.onSearchChange("Ada")}>
        search
      </button>
    </div>
  ),
}));

vi.mock("./GroupRecipientsTable", () => ({
  GroupRecipientsTable: (props: {
    onToggleGroup: (group: {
      name: string;
      description: string;
      customers: { id: string; name: string }[]
    }, checked: boolean) => void;
  }) => (
    <button
      type="button"
      onClick={() =>
        props.onToggleGroup(
          { name: "1A", description: "", customers: [{ id: "c1", name: "Ada" }] },
          true,
        )
      }
    >
      toggle-group
    </button>
  ),
}));

vi.mock("./PersonRecipientsTable", () => ({
  PersonRecipientsTable: (props: {
    onToggleRecipient: (recipient: { id: string; name: string }, checked: boolean) => void;
  }) => (
    <button
      type="button"
      onClick={() => props.onToggleRecipient({ id: "p1", name: "Per" }, true)}
    >
      toggle-person
    </button>
  ),
}));

vi.mock("../StepNavigation", () => ({
  StepNavigation: ({ disabled }: { disabled?: boolean }) => (
    <div>{disabled ? "recipient-next-disabled" : "recipient-next-enabled"}</div>
  ),
}));

vi.mock("./FileUploadModal", () => ({
  FileUploadModal: (props: { onFileUpload: (file: File) => void }) => (
    <button
      type="button"
      onClick={() => props.onFileUpload(new File(["x"], "people.csv", { type: "text/csv" }))}
    >
      upload-file
    </button>
  ),
}));

vi.mock("~/components/stepper/recipients/SelectedRecipientsModal", () => ({
  default: () => <div>selected-recipients-modal</div>,
}));

vi.mock("@navikt/ds-react", () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Detail: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  Heading: ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>,
  HStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  VStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("SelectRecipientStep", () => {
  it("shows disabled next state when no recipients selected", () => {
    render(
      <SelectRecipientStep
        groupRecipients={[]}
        personRecipients={[]}
        selectedRecipients={[]}
        setSelectedRecipients={vi.fn()}
        onNext={vi.fn()}
        currentSchoolOrgId="school.org"
      />,
    );

    expect(screen.getByText("recipient-next-disabled")).toBeTruthy();
  });

  it("uses setter callback for group toggles and uploads file", () => {
    const setSelectedRecipients = vi.fn();
    render(
      <SelectRecipientStep
        groupRecipients={[{ name: "1A", description: "", customers: [{ id: "c1", name: "Ada" }] }]}
        personRecipients={[]}
        selectedRecipients={[{ id: "s1", name: "Selected" }]}
        setSelectedRecipients={setSelectedRecipients}
        onNext={vi.fn()}
        currentSchoolOrgId="school.org"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "toggle-group" }));
    fireEvent.click(screen.getByRole("button", { name: "upload-file" }));

    expect(setSelectedRecipients).toHaveBeenCalled();
    expect(mocks.sendFile).toHaveBeenCalledWith(
      "school.org",
      expect.objectContaining({ name: "people.csv" }),
    );
  });
});
