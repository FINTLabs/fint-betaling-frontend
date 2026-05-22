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
          <List as="ul">
            {selectedProducts.map((product) => {
              const price =
                product.customPrice !== undefined
                  ? product.customPrice
                  : product.itemPrice;
              const productTotal = price * product.quantity;

              return (
                <List.Item
                  key={product.itemCode}
                  icon={<TrashIcon aria-hidden />}
                  title={`${product.description} (${product.itemCode})`}
                  onClick={() => onRemoveProduct(product)}
                >
                  {product.freeText && ` - Fritekst: ${product.freeText}`}
                  {" - Pris pr. enhet: "}
                  {formatPrice(price)} - Antall: {product.quantity} - Sum:{" "}
                  {formatPrice(productTotal)}
                </List.Item>
              );
            })}
          </List>
        )}
      </VStack>
    </Box>
  );
}
