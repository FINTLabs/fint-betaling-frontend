import { render, screen } from "@testing-library/react";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import type { BatchData } from "~/components/dashboard/BatchHistory";
import Home from "./home";

describe("home dashboard", () => {
  it("renders the dashboard and lets stats finish while batch history is pending", async () => {
    const orders = { pendingOrders: 24, errorOrders: 3 };
    let resolveStats!: (value: { stats: typeof orders }) => void;
    const statsResponse = new Promise<{ stats: typeof orders }>((resolve) => {
      resolveStats = resolve;
    });
    type BatchResponse = { batches: BatchData[]; paidOrders: number };
    let resolveBatches!: (value: BatchResponse) => void;
    const batchResponse = new Promise<BatchResponse>((resolve) => {
      resolveBatches = resolve;
    });
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: (
            <Outlet context={{ name: "Eksempelskolen", organisationNumber: "1" }} />
          ),
          children: [
            { index: true, Component: Home },
            { path: "_dashboard/stats", loader: () => statsResponse },
            { path: "_dashboard/batches", loader: () => batchResponse },
          ],
        },
      ],
      { basename: "/afk", initialEntries: ["/afk/"] },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText("Dashboard - Eksempelskolen")).toBeTruthy();
    expect(screen.getAllByTitle(/^Henter/)).toHaveLength(3);
    expect(screen.getByText("Henter batchhistorikk …")).toBeTruthy();

    resolveStats({ stats: orders });

    expect(await screen.findByText("24")).toBeTruthy();
    expect(screen.getAllByTitle(/^Henter/)).toHaveLength(1);
    expect(screen.getByTitle("Henter betalte ordrer")).toBeTruthy();
    expect(screen.getByText("Henter batchhistorikk …")).toBeTruthy();

    resolveBatches({
      paidOrders: 121,
      batches: [{
        date: "2024-01-03T10:00:00Z",
        totalRecords: 8,
        sent: 8,
        errors: 0,
        stored: 0,
        cancelled: 0,
      }],
    });

    expect(await screen.findByRole("table")).toBeTruthy();
    expect(screen.getByText("121")).toBeTruthy();
    expect(screen.queryByTitle(/^Henter/)).toBeNull();
    expect(screen.queryByText("Henter batchhistorikk …")).toBeNull();
  });
});
