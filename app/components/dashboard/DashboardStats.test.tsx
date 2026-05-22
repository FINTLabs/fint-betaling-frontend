import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardStats } from "./DashboardStats";

vi.mock("@navikt/ds-react", () => {
  const Detail = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
  const Heading = ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>;
  const HGrid = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const InfoCard = ({
    children,
    "data-color": dataColor,
  }: {
    children: React.ReactNode;
    "data-color"?: string;
  }) => <section data-color={dataColor}>{children}</section>;

  InfoCard.Header = ({ children }: { children: React.ReactNode }) => (
    <header>{children}</header>
  );
  InfoCard.Title = ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>;
  InfoCard.Content = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );

  return { Detail, Heading, HGrid, InfoCard };
});

describe("DashboardStats", () => {
  it("renders stat titles, values and descriptions", () => {
    render(
      <DashboardStats totalOrders={100} pendingOrders={10} errorOrders={5} />,
    );

    expect(screen.getByText("Totalt antall ordrer")).toBeTruthy();
    expect(screen.getByText("Ventende ordrer")).toBeTruthy();
    expect(screen.getByText("Antall feil")).toBeTruthy();
    expect(screen.getByText("100")).toBeTruthy();
    expect(screen.getByText("10")).toBeTruthy();
    expect(screen.getByText("5")).toBeTruthy();
    expect(screen.getByText("Total antall ordrer siste 14 dager")).toBeTruthy();
  });

  it("sets expected semantic colors for each card", () => {
    const { container } = render(
      <DashboardStats totalOrders={1} pendingOrders={2} errorOrders={3} />,
    );

    const cards = container.querySelectorAll("section[data-color]");
    expect(cards[0]?.getAttribute("data-color")).toBe("success");
    expect(cards[1]?.getAttribute("data-color")).toBe("info");
    expect(cards[2]?.getAttribute("data-color")).toBe("danger");
  });
});
