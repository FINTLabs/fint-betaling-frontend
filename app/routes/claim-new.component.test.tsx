import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ClaimNew from "./claim-new";

const mocks = vi.hoisted(() => ({
  useLoaderData: vi.fn(),
  submit: vi.fn(),
}));

vi.mock("~/api/MeApi", () => ({
  default: { fetchMe: vi.fn() },
}));

vi.mock("~/api/SchoolGroupApi", () => ({
  default: {
    getBasisGroups: vi.fn(),
    getTeachingGroups: vi.fn(),
    getSchool: vi.fn(),
  },
}));

vi.mock("~/api/PrincipalApi", () => ({
  default: { getPrincipals: vi.fn() },
}));

vi.mock("~/api/ClaimApi", () => ({
  default: { createClaim: vi.fn() },
}));

vi.mock("~/utils/cookie", () => ({
  selectOrgCookie: { parse: vi.fn() },
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

describe("claim-new route component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useLoaderData.mockReturnValue({
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
