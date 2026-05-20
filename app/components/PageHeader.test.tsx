import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PageHeader } from "./PageHeader";

vi.mock("@navikt/ds-react", () => ({
  Box: ({ children }: React.PropsWithChildren) => (
    <div data-testid="page-header-box">{children}</div>
  ),
  VStack: ({ children }: React.PropsWithChildren) => (
    <div data-testid="page-header-stack">{children}</div>
  ),
  Heading: ({ children }: React.PropsWithChildren) => <h2>{children}</h2>,
  Detail: ({ children }: React.PropsWithChildren) => (
    <div data-testid="page-header-detail">{children}</div>
  ),
}));

describe("PageHeader", () => {
  it("renders the title", () => {
    render(<PageHeader title="My page" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "My page" }),
    ).toBeTruthy();
  });

  it("renders a string description when provided", () => {
    render(
      <PageHeader
        title="Orders"
        description="Filter and browse your orders"
      />,
    );

    expect(screen.getByText("Filter and browse your orders")).toBeTruthy();
    expect(screen.getByTestId("page-header-detail")).toBeTruthy();
  });

  it("renders ReactNode descriptions", () => {
    render(
      <PageHeader
        title="Dashboard"
        description={
          <span data-testid="custom-desc">
            Mixed <strong>emphasis</strong>
          </span>
        }
      />,
    );

    expect(screen.getByTestId("custom-desc")).toBeTruthy();
    expect(screen.getByText("Mixed")).toBeTruthy();
    expect(screen.getByText("emphasis")).toBeTruthy();
  });

  it("omits detail when description is not passed", () => {
    render(<PageHeader title="Only title" />);

    expect(screen.queryByTestId("page-header-detail")).toBeNull();
    expect(screen.getByRole("heading", { name: "Only title" })).toBeTruthy();
  });

  it("does not render detail when description is empty string", () => {
    render(<PageHeader title="T" description="" />);

    expect(screen.queryByTestId("page-header-detail")).toBeNull();
  });
});
