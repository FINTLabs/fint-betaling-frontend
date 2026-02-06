import { VStack, Box, Stepper } from "@navikt/ds-react";
import { useState, useEffect, useRef } from "react";
import {
  type LoaderFunctionArgs,
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookieValue = await selectOrgCookie.parse(cookieHeader);

  const [
    schoolGroupsResponse,
    teachingGroupsResponse,
    schoolResponse,
    principalsResponse,
  ] = await Promise.all([
    SchoolGroupApi.getBasisGroups(cookieValue),
    SchoolGroupApi.getTeachingGroups(cookieValue),
    SchoolGroupApi.getSchool(cookieValue),
    PrincipalApi.getPrincipals(cookieValue),
  ]);

  console.log("schoolGroupsResponse: ", schoolResponse.data);
  return {
    schoolGroups: schoolGroupsResponse.data || [],
    teachingGroups: teachingGroupsResponse.data || [],
    school: schoolResponse.data || [],
    principals: principalsResponse.data || [],
    currentSchoolOrgId: cookieValue,
  };
};

export default function OrderNew() {
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
  } = useLoaderData<{
    schoolGroups: IClassGroup[];
    teachingGroups: IClassGroup[];
    school: ISchool;
    principals: IProductData;
    currentSchoolOrgId: string;
  }>();

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
          onSendToFakturering={() => {
            navigate("/historikk");
          }}
          onEditRecipients={() => setActiveStep(1)}
          onEditProducts={() => setActiveStep(2)}
        />
      )}
    </VStack>
  );
}
