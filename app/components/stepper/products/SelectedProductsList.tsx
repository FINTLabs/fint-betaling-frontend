import { Box, Button, Heading, VStack, HStack } from "@navikt/ds-react";
import type { ISelectedProduct } from "~/types/product";
import { TrashIcon } from "@navikt/aksel-icons";

// Format price from øre to kr and øre
const formatPrice = (priceInOre: number): string => {
  const kroner = Math.floor(priceInOre / 100);
  const ore = priceInOre % 100;
  return `${kroner} ${ore.toString().padStart(2, "0")}`;
};

interface SelectedProductsListProps {
  selectedProducts: ISelectedProduct[];
  onRemoveProduct: (product: ISelectedProduct) => void;
}

export function SelectedProductsList({
  selectedProducts,
  onRemoveProduct,
}: SelectedProductsListProps) {
  // Calculate total: sum of (price * quantity) for all selected products
  const total = selectedProducts.reduce((sum, product) => {
    const price = product.customPrice !== undefined 
      ? product.customPrice 
      : product.itemPrice;
    return sum + price * product.quantity;
  }, 0);

  return (
    <Box
      padding="6"
      background="surface-subtle"
      borderRadius="large"
      borderWidth="1"
      borderColor="border-subtle"
    >
      <VStack gap="3">
        <Heading size="small" level="4" spacing>
          Valgte produkter ({selectedProducts.length})
        </Heading>
        {selectedProducts.length === 0 ? (
          <Box
            padding="4"
            background="surface-default"
            borderRadius="medium"
            style={{
              border: "1px dashed var(--a-border-subtle)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "var(--a-text-subtle)",
                margin: 0,
                fontSize: "0.875rem",
              }}
            >
              Ingen produkter valgt ennå. Velg produkter fra listen under.
            </p>
          </Box>
        ) : (
          <VStack gap="2">
            {selectedProducts.map((product) => {
              const price = product.customPrice !== undefined 
                ? product.customPrice 
                : product.itemPrice;
              const productTotal = price * product.quantity;
              
              return (
              <Box
                key={product.itemCode}
                padding="3"
                background="surface-default"
                borderRadius="medium"
                borderWidth="1"
                borderColor="border-subtle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    flex: 1,
                  }}
                >
                  <span style={{ fontSize: "0.875rem", fontWeight: 400 }}>
                      {product.description} ({product.itemCode})
                      {product.freeText && ` - Fritekst: ${product.freeText}`}
                      {" - Pris pr. enhet: "}{formatPrice(price)} - Antall:{" "}
                      {product.quantity} - Sum: {formatPrice(productTotal)}
                  </span>
                </Box>
                <Button
                  icon={<TrashIcon title="Fjern" />}
                  onClick={() => onRemoveProduct(product)}
                  variant="tertiary"
                  size="small"
                />
              </Box>
              );
            })}
            {/* Total row */}
            <Box
              padding="4"
              background="surface-default"
              borderRadius="medium"
              borderWidth="2"
              borderColor="border-strong"
              style={{
                marginTop: "0.5rem",
              }}
            >
              <HStack justify="space-between" align="center">
                <Heading size="small" level="4" spacing={false}>
                  Totalt:
                </Heading>
                <Heading size="small" level="4" spacing={false}>
                  {formatPrice(total)}
                </Heading>
              </HStack>
            </Box>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
