import { describe, expect, it } from "vitest";
import {
  DEFAULT_STATUS_CONFIG,
  getStatusConfig,
  getStatusMessage,
} from "./ClaimStatusConfig";

describe("ClaimStatusConfig", () => {
  it("returns stored helper text for STORED status", () => {
    const message = getStatusMessage(undefined, "STORED");

    expect(message).toContain("Ordre er lagret, men ikke sendt");
  });

  it("extracts parsed message from JSON status message", () => {
    const message = getStatusMessage('{"message":"Feil i økonomisystem"}');

    expect(message).toBe("Feil i økonomisystem");
  });

  it("returns raw status message when it is not JSON", () => {
    const message = getStatusMessage("Vanlig tekst-feil");

    expect(message).toBe("Vanlig tekst-feil");
  });

  it("falls back to error message and finally default message", () => {
    expect(getStatusMessage(undefined, undefined, "Fallback-feil")).toBe(
      "Fallback-feil",
    );
    expect(getStatusMessage()).toBe(
      "Sorry, men vi har ikke fått noen detaljer fra økonomisystemet!",
    );
  });

  it("returns exact status match from list", () => {
    const status = getStatusConfig("PAID");

    expect(status.value).toBe("PAID");
    expect(status.label).toBe("Betalt");
  });

  it("handles message-based and localized status matching", () => {
    expect(getStatusConfig("whatever", "Ordre kansellert av bruker").value).toBe(
      "CANCELLED",
    );
    expect(getStatusConfig("betalt").value).toBe("PAID");
    expect(getStatusConfig("kreditert").value).toBe("CREDITED");
  });

  it("maps specific error variants and unknown values", () => {
    expect(getStatusConfig("update_error", "oppdatering feilet").value).toBe(
      "UPDATE_ERROR",
    );
    expect(getStatusConfig("send_error", "innsendelse feilet").value).toBe(
      "SEND_ERROR",
    );
    expect(getStatusConfig("accept_error", "oversending feilet").value).toBe(
      "ACCEPT_ERROR",
    );
    expect(getStatusConfig("mystery-status")).toEqual(DEFAULT_STATUS_CONFIG);
  });
});
