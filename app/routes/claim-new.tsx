import { Box, Stepper, VStack } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import {
  type ActionFunction,
  type LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "react-router";
import { SelectRecipientStep } from "~/components/stepper/recipients/SelectRecipientStep";
import { SelectProductStep } from "~/components/stepper/products/SelectProductStep";
import { SaveStep } from "~/components/stepper/SaveStep";
import type { IClassGroup, ICustomer, ISchool } from "~/types/group";
import type { IProductData, ISelectedProduct } from "~/types/product";
import { selectOrgCookie } from "~/utils/cookie";
import SchoolGroupApi from "~/api/SchoolGroupApi";
import PrincipalApi from "~/api/PrincipalApi";
import ClaimApi from "~/api/ClaimApi";
import MeApi from "~/api/MeApi";
import type { IUser } from "~/types/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookieValue = await selectOrgCookie.parse(cookieHeader);

  const [
    schoolGroupsResponse,
    teachingGroupsResponse,
    schoolResponse,
    principalsResponse,
    meResponse,
  ] = await Promise.all([
    SchoolGroupApi.getBasisGroups(cookieValue),
    SchoolGroupApi.getTeachingGroups(cookieValue),
    SchoolGroupApi.getSchool(cookieValue),
    PrincipalApi.getPrincipals(cookieValue),
    MeApi.fetchMe(),
  ]);

  // console.log("schoolGroupsResponse: ", schoolResponse.data);
  // console.log("teachingGroupsResponse: ", teachingGroupsResponse.data);
  // console.log("schoolResponse: ", schoolResponse.data);
  // console.log("principalsResponse: ", principalsResponse.data);
  return {
    schoolGroups: schoolGroupsResponse.data || [],
    teachingGroups: teachingGroupsResponse.data || [],
    school: schoolResponse.data || [],
    principals: principalsResponse.data || [],
    currentSchoolOrgId: cookieValue,
    user: meResponse,
  };
};

export default function ClaimNew() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedRecipients, setSelectedRecipients] = useState<ICustomer[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ISelectedProduct[]>(
    [],
  );

  const {
    schoolGroups,
    teachingGroups,
    school,
    principals,
    currentSchoolOrgId,
    user,
  } = useLoaderData<{
    schoolGroups: IClassGroup[];
    teachingGroups: IClassGroup[];
    school: ISchool;
    principals: IProductData;
    currentSchoolOrgId: string;
    user: IUser;
  }>();

  const fetcher = useFetcher();

  // Track the organization and clear state when it changes
  const previousOrgRef = useRef<string>(currentSchoolOrgId);

  useEffect(() => {
    if (previousOrgRef.current !== currentSchoolOrgId) {
      // Organization has changed, clear the selections and reset to step 1
      setSelectedRecipients([]);
      setSelectedProducts([]);
      setActiveStep(1);
      previousOrgRef.current = currentSchoolOrgId;
    }
  }, [currentSchoolOrgId]);

  async function onSaveInvoices(formData: FormData) {
    formData.append("actionType", "SAVE_INVOICES");

    formData.append("selectedRecipients", JSON.stringify(selectedRecipients));
    formData.append("selectedProducts", JSON.stringify(selectedProducts));
    formData.append(
      "organisationUnit",
      JSON.stringify({
        organisationNumber: currentSchoolOrgId,
        name: school.name || "",
      }),
    );
    formData.append("principal", JSON.stringify(principals));
    formData.append("user", JSON.stringify(user));

    formData.append("selectedOrg", currentSchoolOrgId);

    fetcher.submit(formData, {
      method: "post",
    });
  }

  return (
    <VStack gap="8">
      <Box>
        <Stepper
          activeStep={activeStep}
          onStepChange={setActiveStep}
          orientation="horizontal"
        >
          <Stepper.Step
            as="button"
            onClick={() => setActiveStep(1)}
            completed={activeStep > 1}
          >
            Velg mottaker
          </Stepper.Step>
          <Stepper.Step
            as="button"
            onClick={() => setActiveStep(2)}
            completed={activeStep > 2}
          >
            Velg produkt
          </Stepper.Step>
          <Stepper.Step as="button" onClick={() => setActiveStep(3)}>
            Lagre
          </Stepper.Step>
        </Stepper>
      </Box>

      {activeStep === 1 && (
        <SelectRecipientStep
          groupRecipients={[...schoolGroups, ...teachingGroups]}
          personRecipients={school.customers}
          selectedRecipients={selectedRecipients}
          setSelectedRecipients={setSelectedRecipients}
          onNext={() => setActiveStep(2)}
          currentSchoolOrgId={currentSchoolOrgId}
        />
      )}

      {activeStep === 2 && (
        <SelectProductStep
          selectedRecipients={selectedRecipients}
          products={principals.lineitems}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          onNext={() => setActiveStep(3)}
          onPrevious={() => setActiveStep(1)}
        />
      )}

      {activeStep === 3 && (
        <SaveStep
          selectedRecipients={selectedRecipients}
          selectedProducts={selectedProducts}
          organisationUnit={{
            organisationNumber: currentSchoolOrgId,
            name: school.name || "",
          }}
          principal={principals}
          onPrevious={() => setActiveStep(2)}
          onView={() => {
            navigate("/send");
          }}
          onSendToFactoring={onSaveInvoices}
          onEditRecipients={() => setActiveStep(1)}
          onEditProducts={() => setActiveStep(2)}
        />
      )}
    </VStack>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType") as string;
  const selectedOrg = formData.get("selectedOrg") as string;

  // TODO: use string values in send
  const selectedRecipientsStr = formData.get("selectedRecipients") as string;
  const selectedProductsStr = formData.get("selectedProducts") as string;
  const organisationUnitStr = formData.get("organisationUnit") as string;
  const principalStr = formData.get("principal") as string;
  const userStr = formData.get("user") as string;

  let response;

  try {
    const selectedRecipients = JSON.parse(selectedRecipientsStr || "[]");
    const selectedProducts = JSON.parse(selectedProductsStr || "[]");
    const organisationUnit = JSON.parse(organisationUnitStr || "{}");
    const principal = JSON.parse(principalStr || "{}");
    const user = JSON.parse(userStr || "{}");

    switch (actionType) {
      case "SAVE_INVOICES":
        response = await ClaimApi.setPayment(
          selectedOrg,
          selectedRecipients,
          selectedProducts,
          organisationUnit,
          principal,
          user,
        );
        break;
      case "SEND_TO_FACTORING":
        response = await ClaimApi.sendClaims(
          selectedRecipients,
          selectedProducts,
          organisationUnit,
          principal,
          user,
        );
        break;
      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: `Ukjent handlingstype: '${actionType}'`,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
    }

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Kunne ikke parse form data.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
