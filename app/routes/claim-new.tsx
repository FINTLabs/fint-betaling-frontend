import {Box, Stepper, VStack} from "@navikt/ds-react";
import React, {useEffect, useRef, useState} from "react";
import {type ActionFunction, type LoaderFunctionArgs, redirect, useFetcher, useLoaderData,} from "react-router";
import {SelectRecipientStep} from "~/components/stepper/recipients/SelectRecipientStep";
import {SelectProductStep} from "~/components/stepper/products/SelectProductStep";
import {SaveStep} from "~/components/stepper/SaveStep";
import type {IClassGroup, ICustomer, ISchool} from "~/types/group";
import type {IProductData, ISelectedProduct} from "~/types/product";
import {selectOrgCookie} from "~/utils/cookie";
import SchoolGroupApi from "~/api/SchoolGroupApi";
import PrincipalApi from "~/api/PrincipalApi";
import ClaimApi from "~/api/ClaimApi";
import MeApi from "~/api/MeApi";
import type {IUser} from "~/types/user";
import type {INewClaim} from "~/types/newClaim";
import {NovariToaster, useAlerts} from "novari-frontend-components";
import type {IClaim} from "~/types/claim";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookieValue = await selectOrgCookie.parse(cookieHeader);
  const meResponse = await MeApi.fetchMe(request);
  const currentSchoolOrgId =
    cookieValue ?? meResponse.organisationUnits[0]?.organisationNumber;

  if (!currentSchoolOrgId) {
    return {
      schoolGroups: [],
      teachingGroups: [],
      school: [],
      principals: [],
      currentSchoolOrgId: "",
      user: meResponse,
    };
  }

  const [
    schoolGroupsResponse,
    teachingGroupsResponse,
    schoolResponse,
    principalsResponse,
  ] = await Promise.all([
    SchoolGroupApi.getBasisGroups(currentSchoolOrgId, request),
    SchoolGroupApi.getTeachingGroups(currentSchoolOrgId, request),
    SchoolGroupApi.getSchool(currentSchoolOrgId, request),
    PrincipalApi.getPrincipals(currentSchoolOrgId, request),
  ]);

  return {
    schoolGroups: schoolGroupsResponse.data || [],
    teachingGroups: teachingGroupsResponse.data || [],
    school: schoolResponse.data || [],
    principals: principalsResponse.data || [],
    currentSchoolOrgId,
    user: meResponse,
  };
};

export default function ClaimNew() {
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
  const actionData = fetcher.data;
  const { alertState } = useAlerts<IClaim>([], actionData, fetcher.state);

  // Track the organization and clear state when it changes
  const previousOrgRef = useRef<string>(currentSchoolOrgId);

  useEffect(() => {
    if (previousOrgRef.current !== currentSchoolOrgId) {
      setSelectedRecipients([]);
      setSelectedProducts([]);
      setActiveStep(1);
      previousOrgRef.current = currentSchoolOrgId;
    }
  }, [currentSchoolOrgId]);

 function onSaveInvoices(formData: FormData) {

    const orderItems = selectedProducts.map((product) => {
      return {
        description: product.description,
        itemQuantity: product.quantity,
        itemPrice: product.customPrice || product.itemPrice,
        itemCode: product.itemCode,
        originalItemPrice: product.itemPrice,
        taxrate: product.taxrate,
        originalDescription: product.description,
        itemUri: product.uri,
      };
    });

    const customers = selectedRecipients.map((customer) => {
      return {
        id: customer.id,
        name: customer.name,
      };
    });


    const newClaim: INewClaim = {
      orderItems: orderItems,
      customers: customers,
      organisationUnit: {
        name: school.name,
        organisationNumber: currentSchoolOrgId,
      },
      principal: principals,
      createdBy: {
        name: user.name,
        employeeNumber: user.employeeNumber,
        organisation: user.organisation,
        organisationUnits: user.organisationUnits,
        idleTime: 0,
        admin: user.admin,
      },
    }

    formData.append("selectedOrg", currentSchoolOrgId);
    formData.append("newClaim", JSON.stringify(newClaim));

    fetcher.submit(formData, {
      method: "post",
    });
  }

  return (
    <VStack gap="space-6">

      <NovariToaster
          items={alertState}
          position={"top-right"}
          // onCloseItem={handleCloseItem}
      />

      <Box padding={"space-16"}>

        <Stepper
          activeStep={activeStep}
          onStepChange={setActiveStep}
          orientation="horizontal"
        >
          <Stepper.Step
            onClick={() => setActiveStep(1)}
            completed={selectedRecipients.length > 0}
          >
            Velg mottaker
          </Stepper.Step>
          <Stepper.Step
            onClick={() => setActiveStep(2)}
            completed={selectedProducts.length > 0}
            interactive={selectedRecipients.length > 0}
          >
            Velg produkt
          </Stepper.Step>
          <Stepper.Step onClick={() => setActiveStep(3)} interactive={selectedProducts.length > 0 && selectedRecipients.length > 0}
          >
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
          onPrevious={() => setActiveStep(2)}
          onSendToFactoring={onSaveInvoices}
        />
      )}
    </VStack>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType") as string;
  const selectedOrg = formData.get("selectedOrg") as string;
  const claimBody = formData.get("newClaim") as string;

  let response;
    switch (actionType) {
      case "SAVE_INVOICES":
        response = ClaimApi.createClaim(selectedOrg, claimBody, request);
        if((await response).success){
          return redirect(`/send`);
        }
        break;
      case "SEND_TO_FACTORING":
        response = {
          success: true,
          message: "TESTING SEND_TO_FACTORING",
          variant: "warning",
        };
        break;
      default:
        return {
          success: false,
          message: `Ukjent handlingstype: '${actionType}'`,
          variant: "error",
        };
    }

    return response;

};
