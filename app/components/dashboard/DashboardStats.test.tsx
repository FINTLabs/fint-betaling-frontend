import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { DashboardStats } from "./DashboardStats";

describe("DashboardStats", () => {
  it("renders stat titles, counts and links under the router basename", () => {
    render(
      <MemoryRouter basename="/afk" initialEntries={["/afk/"]}>
        <DashboardStats paidOrders={100} pendingOrders={10} errorOrders={5} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Betalte ordrer siste 12 måneder")).toBeTruthy();
    expect(screen.getByText("Ventende ordrer")).toBeTruthy();
    expect(screen.getByText("Antall feil")).toBeTruthy();
    expect(screen.getByText("100")).toBeTruthy();
    expect(screen.getByText("10")).toBeTruthy();
    expect(screen.getByText("5")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Se ventende ordrer" }).getAttribute("href"),
    ).toBe("/afk/send");
  });

  it("shows the loading indicators, then replaces them with the counts", () => {
    const { rerender } = render(
      <MemoryRouter>
        <DashboardStats loading />
      </MemoryRouter>,
    );

    expect(screen.getAllByTitle(/^Henter/)).toHaveLength(3);
    expect(screen.queryByText("0")).toBeNull();

    rerender(
      <MemoryRouter>
        <DashboardStats paidOrders={2} pendingOrders={2} errorOrders={0} />
      </MemoryRouter>,
    );

    expect(screen.queryByTitle(/^Henter/)).toBeNull();
    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getByText("0")).toBeTruthy();
  });
});
