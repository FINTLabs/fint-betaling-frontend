import {Box, HStack, Loader, Stepper, VStack} from "@navikt/ds-react";
import React, {Suspense, useState} from "react";
import {Await, type ActionFunction, type LoaderFunctionArgs, redirect, useFetcher, useLoaderData} from "react-router";
import {SelectRecipientStep} from "~/components/stepper/recipients/SelectRecipientStep";
import {SelectProductStep} from "~/components/stepper/products/SelectProductStep";
import {SaveStep} from "~/components/stepper/SaveStep";
import type {ICustomer} from "~/types/group";
import type {ISelectedProduct} from "~/types/product";
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
  const user = await MeApi.fetchMe(request);
  const currentSchoolOrgId =
    cookieValue ?? user.organisationUnits[0]?.organisationNumber ?? "";

  return {
    currentSchoolOrgId,
    user,
    selection: loadClaimSelection(request, currentSchoolOrgId),
  };
};

async function loadClaimSelection(request: Request, currentSchoolOrgId: string) {
  if (!currentSchoolOrgId) {
    return {
      schoolGroups: [],
      teachingGroups: [],
      school: null,
      principals: null,
    };
  }

  const [
    schoolGroupsResponse,
    teachingGroupsResponse,
    schoolResponse,
    principalsResponse,
  ] = await Promise.all([
    SchoolGroupApi.getBasisGroups(request, currentSchoolOrgId),
    SchoolGroupApi.getTeachingGroups(request, currentSchoolOrgId),
    SchoolGroupApi.getSchool(request, currentSchoolOrgId),
    PrincipalApi.getPrincipals(request, currentSchoolOrgId),
  ]);

  return {
    schoolGroups: schoolGroupsResponse.data || [],
    teachingGroups: teachingGroupsResponse.data || [],
    school: schoolResponse.data ?? null,
    principals: principalsResponse.data ?? null,
  };
}

type ClaimSelection = Awaited<ReturnType<typeof loadClaimSelection>>;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType") as string;
  const selectedOrg = formData.get("selectedOrg") as string;
  const claimBody = formData.get("newClaim") as string;

  let response;
  switch (actionType) {
    case "SAVE_INVOICES":
      response = ClaimApi.createClaim(request, selectedOrg, claimBody);
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

export default function ClaimNew() {
  const { currentSchoolOrgId, user, selection } = useLoaderData<typeof loader>();

  return (
    <Suspense
      key={currentSchoolOrgId}
      fallback={
        <HStack gap="space-8" align="center" role="status">
          <Loader size="small" aria-hidden="true" />
          <span>Henter mottakere og produkter …</span>
        </HStack>
      }
    >
      <Await resolve={selection} errorElement={<p role="alert">Kunne ikke hente mottakere og produkter.</p>}>
        {(data: ClaimSelection) => (
          <ClaimNewSteps selection={data} currentSchoolOrgId={currentSchoolOrgId} user={user} />
        )}
      </Await>
    </Suspense>
  );
}

function ClaimNewSteps({
  selection: { schoolGroups, teachingGroups, school, principals },
  currentSchoolOrgId,
  user,
}: {
  selection: ClaimSelection;
  currentSchoolOrgId: string;
  user: IUser;
}) {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedRecipients, setSelectedRecipients] = useState<ICustomer[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ISelectedProduct[]>(
    [],
  );

  const fetcher = useFetcher();
  const actionData = fetcher.data;
  const { alertState } = useAlerts<IClaim>([], actionData, fetcher.state);

  function onSaveInvoices(formData: FormData) {
    if (!principals) return;

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
        name: school?.name ??
          user.organisationUnits.find((org) => org.organisationNumber === currentSchoolOrgId)?.name ??
          "",
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
          personRecipients={school?.customers ?? []}
          selectedRecipients={selectedRecipients}
          setSelectedRecipients={setSelectedRecipients}
          onNext={() => setActiveStep(2)}
          currentSchoolOrgId={currentSchoolOrgId}
        />
      )}

      {activeStep === 2 && (
        <SelectProductStep
          selectedRecipients={selectedRecipients}
          products={principals?.lineitems ?? []}
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

