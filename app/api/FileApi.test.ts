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

import FileApi from "./FileApi";

describe("FileApi", () => {
  beforeEach(() => {
    mocks.callMock.mockReset();
  });

  it("builds sendFile request with multipart FormData body", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });
    const file = new File(["csv"], "claims.csv", { type: "text/csv" });

    await FileApi.sendFile("school.org", file);

    expect(mocks.callMock).toHaveBeenCalledTimes(1);
    const payload = mocks.callMock.mock.calls[0]?.[0];

    expect(payload.method).toBe("POST");
    expect(payload.endpoint).toBe("/api/file");
    expect(payload.functionName).toBe("sendFile");
    expect(payload.customErrorMessage).toBe("Kunne ikke sende fil.");
    expect(payload.customSuccessMessage).toBe("Fil sendt.");
    expect(payload.additionalHeaders).toEqual({ "x-school-org-id": "school.org" });
    expect(payload.body).toBeInstanceOf(FormData);
    expect(payload.body.get("file")).toBe(file);
  });
});
