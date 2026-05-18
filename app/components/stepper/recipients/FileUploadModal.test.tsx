import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileUploadModal } from "./FileUploadModal";

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
  const VStack = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Modal = ({
    open,
    children,
  }: {
    open?: boolean;
    children: React.ReactNode;
  }) => (open ? <div>{children}</div> : null);
  Modal.Body = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  Modal.Footer = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

  const FileUpload = {
    Dropzone: ({
      onSelect,
      validator,
    }: {
      onSelect: (files: Array<{ file: File; error?: boolean; reasons: string[] }>) => void;
      validator: (file: File) => true | string;
    }) => (
      <button
        type="button"
        onClick={() => {
          const file = new File(["a"], "recipients.csv", { type: "text/csv" });
          const valid = validator(file) === true;
          onSelect([{ file, error: !valid, reasons: valid ? [] : ["invalid"] }]);
        }}
      >
        select-file
      </button>
    ),
    Item: ({ file }: { file: File }) => <div>{file.name}</div>,
  };

  return { Button, FileUpload, Modal, VStack };
});

describe("FileUploadModal", () => {
  it("uploads selected file and closes modal", () => {
    const onClose = vi.fn();
    const onFileUpload = vi.fn();
    render(
      <FileUploadModal open onClose={onClose} onFileUpload={onFileUpload} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "select-file" }));
    fireEvent.click(screen.getByRole("button", { name: "Last opp fil" }));

    expect(onFileUpload).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
