import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const callMock = vi.fn();
  const managerCtorMock = vi.fn(function NovariApiManagerMock() {
    return { call: callMock };
  });
  return { callMock, managerCtorMock };
});

vi.mock("novari-frontend-components", () => ({
  NovariApiManager: mocks.managerCtorMock,
}));

import ClaimApi from "./ClaimApi";

describe("ClaimApi", () => {
  beforeEach(() => {
    mocks.callMock.mockReset();
  });

  it("builds getClaims request with query parameters", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });

    await ClaimApi.getClaims("school.org", "PENDING", "LAST_30_DAYS", "school-a");

    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "GET",
      endpoint: "/api/claim?status=PENDING&periodSelection=LAST_30_DAYS&schoolSelection=school-a",
      functionName: "getClaims",
      customErrorMessage: "Kunne ikke hente claims.",
      customSuccessMessage: "Claims hentet.",
      additionalHeaders: {
        "x-school-org-id": "school.org",
      },
    });
  });

  it("builds getClaims request without optional filters", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });

    await ClaimApi.getClaims("school.org");

    expect(mocks.callMock).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "/api/claim",
        additionalHeaders: { "x-school-org-id": "school.org" },
      }),
    );
  });

  it("builds sendClaimsToSystem request and uses fixed org header", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });

    await ClaimApi.sendClaimsToSystem("ignored.org", '{"claims":["1"]}');

    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "POST",
      endpoint: "/api/claim/send",
      functionName: "sendClaimsToSystem",
      customErrorMessage: "Kunne ikke sende claims.",
      customSuccessMessage: "Ordrer sendt.",
      body: '{"claims":["1"]}',
      additionalHeaders: {
        "x-org-id": "fintlabs.no",
      },
    });
  });

  it("builds getCountByStatus request with optional filters", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });

    await ClaimApi.getCountByStatus("school.org", "PENDING", "THIS_YEAR", "school-a");

    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "GET",
      endpoint: "/api/claim/count/by-status/PENDING?periodSelection=THIS_YEAR&schoolSelection=school-a",
      functionName: "getCountByStatus",
      customErrorMessage: "Kunne ikke hente antall ordrer.",
      customSuccessMessage: "Antall ordrer hentet.",
      additionalHeaders: {
        "x-school-org-id": "school.org",
      },
    });
  });

  it("builds createClaim request and uses fixed school org header", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });

    await ClaimApi.createClaim("ignored.org", '{"claim":"a"}');

    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "POST",
      endpoint: "/api/claim",
      functionName: "createClaim",
      customErrorMessage: "Kunne ikke lagre ordre.",
      customSuccessMessage: "Ordre lagret.",
      body: '{"claim":"a"}',
      additionalHeaders: {
        "x-school-org-id": "fake.fintlabs.no",
      },
    });
  });

  it("builds cancelClaim request with claim-specific metadata", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });

    await ClaimApi.cancelClaim("school.org", "ORDER-123");

    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "DELETE",
      endpoint: "/api/claim/order-number/ORDER-123",
      functionName: "cancelClaim_ORDER-123",
      customErrorMessage: "Kunne ikke kansellere ordre ORDER-123.",
      customSuccessMessage: "Ordre ORDER-123 kansellert.",
      additionalHeaders: {
        "x-school-org-id": "school.org",
      },
    });
  });
});
