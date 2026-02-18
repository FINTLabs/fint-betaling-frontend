import {Box, FormSummary, VStack,} from "@navikt/ds-react";
import {StepNavigation} from "./StepNavigation";
import type {ICustomer} from "~/types/group";
import type {ISelectedProduct} from "~/types/product";
import {formatCurrency, formatPrice} from "~/utils/variousFormats";

interface SaveStepProps {
  selectedRecipients: ICustomer[];
  selectedProducts: ISelectedProduct[];
  onPrevious?: () => void;
  onSave?: () => void;
  onSendToFactoring: (formData: FormData) => void;
}

export function SaveStep({
  selectedRecipients,
  selectedProducts,
  onPrevious,
  onSendToFactoring,

}: SaveStepProps) {

  // Calculate total amount - use customPrice if set, otherwise itemPrice
  const totalAmount = selectedProducts.reduce((sum, product) => {
    const price =
      product.customPrice !== undefined
        ? product.customPrice
        : product.itemPrice;
    return sum + price * product.quantity;
  }, 0);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("actionType", "SAVE_INVOICES");
    onSendToFactoring(formData);
  };


  return (
    <VStack gap="space-8">
      <FormSummary>
        <FormSummary.Header>
          <FormSummary.Heading level="2">Lagre betaling</FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          {/* Recipients Section */}
          <FormSummary.Answer>
            <FormSummary.Label>Mottakere</FormSummary.Label>
            {selectedRecipients.length === 0 ? (
              <FormSummary.Value>Ingen mottakere valgt</FormSummary.Value>
            ) : (
              <>
                {selectedRecipients.map((recipient) => (
                  <FormSummary.Value key={recipient.id}>
                    {recipient.name}
                  </FormSummary.Value>
                ))}
              </>
            )}
          </FormSummary.Answer>

          {/* Products Section */}
          <FormSummary.Answer>
            <FormSummary.Label>Produkter</FormSummary.Label>
            {selectedProducts.length === 0 ? (
              <FormSummary.Value>Ingen produkter valgt</FormSummary.Value>
            ) : (
              <FormSummary.Value>
                <FormSummary.Answers>
                  {selectedProducts.map((product) => {
                    const price =
                      product.customPrice !== undefined
                        ? product.customPrice
                        : product.itemPrice;
                    const netTotal = price * product.quantity;
                    return (
                      <FormSummary.Answer key={product.itemCode}>
                        <FormSummary.Label>
                          {product.description}
                        </FormSummary.Label>
                        <FormSummary.Value>
                          {product.freeText && (
                            <>
                              Fritekst: {product.freeText}
                              <br />
                            </>
                          )}
                          Kode: {product.itemCode}
                          <br />
                          Antall: {product.quantity}
                          <br />
                          Nettopris: {formatCurrency(price)}
                          <br />
                          Nettototal:{" "}
                          <strong>{formatCurrency(netTotal)}</strong>
                        </FormSummary.Value>
                      </FormSummary.Answer>
                    );
                  })}
                </FormSummary.Answers>
              </FormSummary.Value>
            )}
          </FormSummary.Answer>

          {/* Total Amount Section */}
          {selectedProducts.length > 0 && (
            <FormSummary.Answer className="flex justify-between">
              <FormSummary.Label>Total beløp per elev</FormSummary.Label>
              <FormSummary.Value>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--a-text-subtle)",
                    }}
                  >
                    Alle beløper er uten mva.
                  </span>
                  <span style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                    {formatPrice(totalAmount)}
                  </span>
                </Box>
              </FormSummary.Value>
            </FormSummary.Answer>
          )}
        </FormSummary.Answers>

        <FormSummary.Footer className="flex w-full gap-4">
          <Box style={{ width: "100%" }}>
            <StepNavigation
              onNext={handleSave}
              onPrevious={onPrevious}
              nextButtonText={"Lagre betaling"}
              previousButtonText="Tilbake til produktvalg"
            />
          </Box>
        </FormSummary.Footer>
      </FormSummary>


    </VStack>
  );
}
