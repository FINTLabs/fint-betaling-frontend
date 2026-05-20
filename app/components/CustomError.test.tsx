import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CustomErrorPage from "./CustomError";

vi.mock("@navikt/ds-react", () => {
  const Button = ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
  }) => (
    <button type="button" {...props}>
      {children}
    </button>
  );

  return {
    Box: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    HGrid: ({
      children,
      "data-aksel-template": tpl,
      ...props
    }: React.PropsWithChildren<
      Record<string, unknown> & { "data-aksel-template"?: string }
    >) => (
      <div data-aksel-template={tpl} {...props}>
        {children}
      </div>
    ),
    VStack: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    Heading: ({
      children,
      level,
    }: React.PropsWithChildren<{ level?: string | number }>) => {
      const Tag = typeof level === "number" ? (`h${level}` as keyof JSX.IntrinsicElements) : "h1";
      return <Tag>{children}</Tag>;
    },
    BodyShort: ({ children }: React.PropsWithChildren) => (
      <p>{children}</p>
    ),
    Button,
    Link: ({
      href,
      children,
      onClick,
      target,
      className,
      ...props
    }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
      <a
        href={href}
        onClick={onClick}
        target={target}
        className={className}
        {...props}
      >
        {children}
      </a>
    ),
    List: Object.assign(
      ({ children }: React.PropsWithChildren) => <ul>{children}</ul>,
      {
        Item: ({ children }: React.PropsWithChildren) => (
          <li>{children}</li>
        ),
      },
    ),
  };
});

describe("CustomErrorPage", () => {
  const originalLocation = globalThis.window.location;

  beforeEach(() => {
    delete (globalThis.window as Partial<Window>).location;
    globalThis.window.location = {
      ...originalLocation,
      reload: vi.fn(),
    } as Location;

    vi.spyOn(history, "back").mockImplementation(() => {});
  });

  afterEach(() => {
    globalThis.window.location = originalLocation;
    vi.restoreAllMocks();
  });

  it("renders defaults and status/kode tekst", () => {
    render(<CustomErrorPage />);

    expect(screen.getByText(/Statuskode 500/i)).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Beklager, noe gikk galt." }),
    ).toBeTruthy();
    expect(screen.getByText(/En teknisk feil på våre servere/i)).toBeTruthy();
    expect(screen.getByText(/Feil-data: 500 - unknown/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /laste siden på nytt/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Gå til Dashboard/i })).toBeTruthy();
    const tpl = screen.getByText("Statuskode 500").closest("[data-aksel-template]");
    expect(tpl?.getAttribute("data-aksel-template")).toBe("500-v2");
  });

  it("applies template attribute for status code", () => {
    const { container } = render(
      <CustomErrorPage statusCode={418} statusTitle="Tea time" errorData="" />,
    );
    expect(
      container.querySelector("[data-aksel-template='418-v2']"),
    ).not.toBeNull();
    expect(screen.getByText(/Statuskode 418/i)).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Tea time" })).toBeTruthy();
  });

  it("pretty-prints JSON errorData", () => {
    const json = '{"app":"betaling","detail":"timed out"}' as const;
    const { container } = render(<CustomErrorPage errorData={json} />);
    const footer = [...container.querySelectorAll("p")].find((p) =>
      p.textContent?.includes("Feil-data:"),
    );
    expect(footer?.textContent).toContain('"app": "betaling"');
    expect(footer?.textContent).not.toMatch(/\{"app":"betaling"/);
  });

  it("shows plain non-JSON errorData as-is", () => {
    const { container } = render(<CustomErrorPage errorData="Connection refused" />);
    const footer = [...container.querySelectorAll("p")].find((p) =>
      p.textContent?.includes("Feil-data:"),
    );
    expect(footer?.textContent).toContain("Feil-data: 500 - Connection refused");
  });

  it("hides detailed error footer for 403", () => {
    render(
      <CustomErrorPage
        statusCode={403}
        statusTitle="Ikke tilgang"
        errorData='{"reason":"denied"}'
      />,
    );
    expect(screen.queryByText(/Feil-data:/)).toBeNull();
  });

  it("reload link triggers location.reload", () => {
    render(<CustomErrorPage />);
    fireEvent.click(screen.getByRole("link", { name: /laste siden på nytt/i }));
    expect(location.reload).toHaveBeenCalledTimes(1);
  });

  it("back link triggers history.back", () => {
    render(<CustomErrorPage />);
    fireEvent.click(
      screen.getByRole("link", { name: /gå tilbake til forrige side/i }),
    );
    expect(history.back).toHaveBeenCalledTimes(1);
  });

  it("shows driftsmeldinger and external support links", () => {
    render(<CustomErrorPage />);
    const drift = screen.getByRole("link", {
      name: /sjekk driftsmeldingssiden/i,
    });
    expect(drift.getAttribute("href")).toBe(
      "https://novari.no/driftsmeldinger/",
    );
    const support = screen.getByRole("link", {
      name: /kontakte oss/i,
    });
    expect(support.getAttribute("href")).toBe("https://support.novari.no/");
    expect(support.getAttribute("target")).toBe("_blank");
  });
});
