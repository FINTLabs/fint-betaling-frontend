import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ClaimNew, { action, loader } from "./claim-new";

const mocks = vi.hoisted(() => ({
  parseCookie: vi.fn(),
  fetchMe: vi.fn(),
  getBasisGroups: vi.fn(),
  getTeachingGroups: vi.fn(),
  getSchool: vi.fn(),
  getPrincipals: vi.fn(),
  createClaim: vi.fn(),
  useLoaderData: vi.fn(),
  submit: vi.fn(),
}));

vi.mock("~/utils/cookie", () => ({
  selectOrgCookie: { parse: mocks.parseCookie },
}));

vi.mock("~/api/MeApi", () => ({
  default: { fetchMe: mocks.fetchMe },
}));

vi.mock("~/api/SchoolGroupApi", () => ({
  default: {
    getBasisGroups: mocks.getBasisGroups,
    getTeachingGroups: mocks.getTeachingGroups,
    getSchool: mocks.getSchool,
  },
}));

vi.mock("~/api/PrincipalApi", () => ({
  default: { getPrincipals: mocks.getPrincipals },
}));

vi.mock("~/api/ClaimApi", () => ({
  default: { createClaim: mocks.createClaim },
}));

vi.mock("novari-frontend-components", () => ({
  NovariToaster: () => <div />,
  useAlerts: () => ({ alertState: [] }),
}));

vi.mock("@navikt/ds-react", () => {
  const StepperRoot = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );
  const StepperStep = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );
  return {
    Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    VStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Stepper: Object.assign(StepperRoot, { Step: StepperStep }),
  };
});

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useLoaderData: mocks.useLoaderData,
    useFetcher: () => ({ submit: mocks.submit, data: undefined, state: "idle" }),
  };
});

vi.mock("~/components/stepper/recipients/SelectRecipientStep", () => ({
  SelectRecipientStep: ({
    setSelectedRecipients,
    onNext,
  }: {
    setSelectedRecipients: (value: Array<{ id: string; name: string }>) => void;
    onNext: () => void;
  }) => (
    <div>
      <button onClick={() => setSelectedRecipients([{ id: "r1", name: "Recipient 1" }])}>
        set-recipients
      </button>
      <button onClick={onNext}>to-step-2</button>
    </div>
  ),
}));

vi.mock("~/components/stepper/products/SelectProductStep", () => ({
  SelectProductStep: ({
    setSelectedProducts,
    onNext,
  }: {
    setSelectedProducts: (value: Array<{ itemCode: string; quantity: number }>) => void;
    onNext: () => void;
  }) => (
    <div>
      <button
        onClick={() =>
          setSelectedProducts([
            {
              itemCode: "p1",
              description: "Product 1",
              quantity: 2,
              itemPrice: 100,
              customPrice: null,
              taxrate: 0,
              uri: "/products/1",
            } as never,
          ])
        }
      >
        set-products
      </button>
      <button onClick={onNext}>to-step-3</button>
    </div>
  ),
}));

vi.mock("~/components/stepper/SaveStep", () => ({
  SaveStep: ({
    onSendToFactoring,
  }: {
    onSendToFactoring: (formData: FormData) => void;
  }) => (
    <button
      onClick={() => {
        const formData = new FormData();
        formData.append("actionType", "SAVE_INVOICES");
        onSendToFactoring(formData);
      }}
    >
      save-invoices
    </button>
  ),
}));

const loaderRequest = () =>
  ({
    request: new Request("http://localhost/claim-new"),
    params: {},
    context: {},
  }) as never;

const actionRequest = (formData: FormData) =>
  ({
    request: new Request("http://localhost/claim-new", {
      method: "POST",
      body: formData,
    }),
    params: {},
    context: {},
  }) as never;

const makeLoaderData = () => ({
  schoolGroups: [],
  teachingGroups: [],
  school: { name: "School 1", customers: [] },
  principals: { lineitems: [] },
  currentSchoolOrgId: "school-1",
  user: {
    name: "User Name",
    employeeNumber: "123",
    organisation: { organisationNumber: "school-1", name: "Org" },
    organisationUnits: [{ organisationNumber: "school-1", name: "School 1" }],
    idleTime: 0,
    admin: false,
  },
});

describe("claim-new loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches selection data for current org", async () => {
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue({
      organisationUnits: [{ organisationNumber: "school.org" }],
    });
    mocks.getBasisGroups.mockResolvedValue({ data: [{ name: "1A" }] });
    mocks.getTeachingGroups.mockResolvedValue({ data: [{ name: "T1" }] });
    mocks.getSchool.mockResolvedValue({ data: { customers: [] } });
    mocks.getPrincipals.mockResolvedValue({ data: { lineitems: [] } });

    const result = await loader(loaderRequest());

    expect(result.currentSchoolOrgId).toBe("school.org");
    expect(result.schoolGroups).toEqual([{ name: "1A" }]);
    expect(result.teachingGroups).toEqual([{ name: "T1" }]);
  });
});

describe("claim-new action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /send after successful save", async () => {
    const formData = new FormData();
    formData.append("actionType", "SAVE_INVOICES");
    formData.append("selectedOrg", "school.org");
    formData.append("newClaim", '{"x":1}');
    mocks.createClaim.mockResolvedValue({ success: true });

    const response = await action(actionRequest(formData));

    expect(response).toBeInstanceOf(Response);
    expect((response as Response).headers.get("Location")).toBe("/send");
  });

  it("returns error for unknown action", async () => {
    const formData = new FormData();
    formData.append("actionType", "UNKNOWN");
    formData.append("selectedOrg", "school.org");
    formData.append("newClaim", "{}");

    const response = await action(actionRequest(formData));

    expect(response).toEqual({
      success: false,
      message: "Ukjent handlingstype: 'UNKNOWN'",
      variant: "error",
    });
  });
});

describe("ClaimNew component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useLoaderData.mockReturnValue(makeLoaderData());
  });

  it("submits SAVE_INVOICES payload from step 3", () => {
    render(<ClaimNew />);

    fireEvent.click(screen.getByText("set-recipients"));
    fireEvent.click(screen.getByText("to-step-2"));
    fireEvent.click(screen.getByText("set-products"));
    fireEvent.click(screen.getByText("to-step-3"));
    fireEvent.click(screen.getByText("save-invoices"));

    expect(mocks.submit).toHaveBeenCalledTimes(1);
    const [submittedFormData, submitOptions] = mocks.submit.mock.calls[0];
    expect(submittedFormData.get("actionType")).toBe("SAVE_INVOICES");
    expect(submittedFormData.get("selectedOrg")).toBe("school-1");
    expect(submitOptions).toEqual({ method: "post" });

    const newClaimRaw = submittedFormData.get("newClaim");
    expect(typeof newClaimRaw).toBe("string");
    const newClaim = JSON.parse(String(newClaimRaw));
    expect(newClaim.customers).toEqual([{ id: "r1", name: "Recipient 1" }]);
    expect(newClaim.orderItems[0].itemCode).toBe("p1");
    expect(newClaim.organisationUnit.organisationNumber).toBe("school-1");
  });
});
