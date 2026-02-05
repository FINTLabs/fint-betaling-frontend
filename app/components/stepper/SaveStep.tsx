import {
  Box,
  VStack,
  Button,
  HStack,
  Modal,
  FormSummary,
} from "@navikt/ds-react";
import { useState } from "react";
import { StepNavigation } from "./StepNavigation";
import type { ICustomer } from "~/types/group";
import type { ISelectedProduct } from "~/types/product";

interface SaveStepProps {
  selectedRecipients: ICustomer[];
  selectedProducts: ISelectedProduct[];
  onPrevious?: () => void;
  onSave?: () => void;
  onView?: () => void;
  onSendToFakturering?: () => void;
  onEditRecipients?: () => void;
  onEditProducts?: () => void;
}

// Format price from øre to kr and øre (e.g., 649 99)
const formatPrice = (priceInOre: number): string => {
  const kroner = Math.floor(priceInOre / 100);
  const ore = priceInOre % 100;
  return `${kroner} ${ore.toString().padStart(2, "0")}`;
};

export function SaveStep({
  selectedRecipients,
  selectedProducts,
  onPrevious,
  onSave,
  onView,
  onSendToFakturering,
  onEditRecipients,
  onEditProducts,
}: SaveStepProps) {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Calculate total amount - use customPrice if set, otherwise itemPrice
  const totalAmount = selectedProducts.reduce((sum, product) => {
    const price =
      product.customPrice !== undefined
        ? product.customPrice
        : product.itemPrice;
    return sum + price * product.quantity;
  }, 0);

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setIsSuccessModalOpen(true);
  };

  const handleSendToFakturering = () => {
    if (onSendToFakturering) {
      onSendToFakturering();
    }
    setIsSuccessModalOpen(false);
  };

  const handleView = () => {
    if (onView) {
      onView();
    }
    setIsSuccessModalOpen(false);
  };

  //TODO: add loader after save button
  return (
    <VStack gap="8">
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
                          Nettopris: {formatPrice(price)}
                          <br />
                          Nettototal: <strong>{formatPrice(netTotal)}</strong>
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

        {(onEditRecipients || onEditProducts) && (
          <FormSummary.Footer className="flex gap-4">
            {onEditRecipients && (
              <FormSummary.EditLink as="button" onClick={onEditRecipients}>
                Endre mottakere
              </FormSummary.EditLink>
            )}
            {onEditProducts && (
              <FormSummary.EditLink as="button" onClick={onEditProducts}>
                Endre produkter
              </FormSummary.EditLink>
            )}
          </FormSummary.Footer>
        )}
      </FormSummary>

      {/* Action Button Section */}
      <StepNavigation
        onNext={handleSave}
        onPrevious={onPrevious}
        nextButtonText="Lagre betaling"
        previousButtonText="Tilbake til produktvalg"
        disabled={
          selectedRecipients.length === 0 || selectedProducts.length === 0
        }
      />

      {/* Success Modal */}
      <Modal
        open={isSuccessModalOpen}
        onClose={() => {
          // Prevent closing - modal should only close via buttons
        }}
        onCancel={(e) => {
          // Prevent closing with Escape key
          e.preventDefault();
        }}
        closeOnBackdropClick={false}
        header={{
          heading: "Ordrene er nå opprettet",
          closeButton: false,
        }}
        width="medium"
      >
        <Modal.Body>
          <p style={{ margin: 0 }}>Neste steg er å sende de til fakturering.</p>
        </Modal.Body>
        <Modal.Footer>
          {onView && (
            <Button variant="secondary" onClick={handleView}>
              Vis
            </Button>
          )}
          <Button variant="primary" onClick={handleSendToFakturering}>
            SEND TIL FAKTURERING
          </Button>
        </Modal.Footer>
      </Modal>
    </VStack>
  );
}
