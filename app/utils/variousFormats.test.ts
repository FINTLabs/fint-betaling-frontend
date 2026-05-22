import { beforeEach, describe, expect, it, vi } from "vitest";
import { formatCurrency, formatDate, formatPrice } from "./variousFormats";

describe("variousFormats", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.TZ = "Europe/Oslo";
  });

  describe("formatDate", () => {
    it("formats ISO date strings in Norwegian locale with date and time", () => {
      expect(formatDate("2024-01-15T10:30:00Z")).toBe("15.01.2024, 11:30");
    });

    it("uses nb-NO locale options when formatting", () => {
      const toLocaleDateStringSpy = vi.spyOn(
        Date.prototype,
        "toLocaleDateString",
      );

      formatDate("2024-06-01T08:00:00Z");

      expect(toLocaleDateStringSpy).toHaveBeenCalledWith("nb-NO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    });
  });

  describe("formatPrice", () => {
    it("converts øre to NOK with currency formatting", () => {
      expect(formatPrice(64900)).toBe("649,00\u00a0kr");
      expect(formatPrice(0)).toBe("0,00\u00a0kr");
    });

    it("handles fractional øre amounts", () => {
      expect(formatPrice(12345)).toBe("123,45\u00a0kr");
    });

    it("uses nb-NO currency options when formatting", () => {
      const toLocaleStringSpy = vi.spyOn(Number.prototype, "toLocaleString");

      formatPrice(100);

      expect(toLocaleStringSpy).toHaveBeenCalledWith("nb-NO", {
        style: "currency",
        currency: "NOK",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    });
  });

  describe("formatCurrency", () => {
    it("converts øre to kroner without currency symbol", () => {
      expect(formatCurrency(1200)).toBe("12,00");
      expect(formatCurrency(64900)).toBe("649,00");
    });

    it("always shows two decimal places", () => {
      expect(formatCurrency(100)).toBe("1,00");
      expect(formatCurrency(0)).toBe("0,00");
    });

    it("uses nb-NO number options when formatting", () => {
      const toLocaleStringSpy = vi.spyOn(Number.prototype, "toLocaleString");

      formatCurrency(500);

      expect(toLocaleStringSpy).toHaveBeenCalledWith("nb-NO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    });
  });
});
