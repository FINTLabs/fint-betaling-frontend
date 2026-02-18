import {Box, Detail, Heading, List, VStack} from "@navikt/ds-react";
import type {ISelectedProduct} from "~/types/product";
import {TrashIcon} from "@navikt/aksel-icons";

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
  return (
    <Box
      borderColor="brand-magenta-subtle"
      padding="space-16"
      borderWidth="2"
      borderRadius="12"
      height="20rem"
      overflow="scroll"
      // background="brand-beige-soft"
    >
      <VStack gap="space-4">
        <Heading size="small" level="4" spacing>
          Valgte produkter ({selectedProducts.length})
        </Heading>
        {selectedProducts.length === 0 ? (
          <Detail>
            Ingen produkter valgt ennå. Velg produkter fra listen under.
          </Detail>
        ) : (
          <VStack gap="space-2">
            {selectedProducts.map((product) => {
              const price =
                product.customPrice !== undefined
                  ? product.customPrice
                  : product.itemPrice;
              const productTotal = price * product.quantity;

              return (
                // <Box
                //   key={product.itemCode}
                //   padding="3"
                //   background="surface-default"
                //   borderRadius="medium"
                //   borderWidth="1"
                //   borderColor="border-subtle"
                //   style={{
                //     display: "flex",
                //     alignItems: "center",
                //     justifyContent: "space-between",
                //     gap: "1rem",
                //   }}
                // >
                // <Box>
                //   <Box
                //     style={{
                //       display: "flex",
                //       alignItems: "center",
                //       gap: "0.75rem",
                //       flex: 1,
                //     }}
                //   >
                //     <span style={{ fontSize: "0.875rem", fontWeight: 400 }}>
                //       {product.description} ({product.itemCode})
                //       {product.freeText && ` - Fritekst: ${product.freeText}`}
                //       {" - Pris pr. enhet: "}
                //       {formatPrice(price)} - Antall: {product.quantity} - Sum:{" "}
                //       {formatPrice(productTotal)}
                //     </span>
                //   </Box>
                //   <Button
                //     icon={<TrashIcon title="Fjern" />}
                //     onClick={() => onRemoveProduct(product)}
                //     variant="tertiary"
                //     size="small"
                //   />
                // </Box>
                <List as="ul">
                  <List.Item
                    icon={<TrashIcon aria-hidden />}
                    title={`${product.description} (${product.itemCode})`}
                    onClick={() => onRemoveProduct(product)}
                  >
                    {product.freeText && ` - Fritekst: ${product.freeText}`}
                    {" - Pris pr. enhet: "}
                    {formatPrice(price)} - Antall: {product.quantity} - Sum:{" "}
                    {formatPrice(productTotal)}
                  </List.Item>
                </List>
              );
            })}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
