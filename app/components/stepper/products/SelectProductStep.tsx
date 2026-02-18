import {Box, Detail, Heading, HStack, VStack} from "@navikt/ds-react";
import React, {useState} from "react";
import {ProductsTable} from "./ProductsTable";
import {StepNavigation} from "../StepNavigation";
import type {ICustomer} from "~/types/group";
import type {ILineItem, ISelectedProduct} from "~/types/product";
import {formatPrice} from "~/utils/variousFormats";
import SelectedRecipientsModal from "~/components/stepper/recipients/SelectedRecipientsModal";
import SelectedProductsModal from "~/components/stepper/products/SelectedProductsModal";

interface SelectProductStepProps {
  selectedRecipients: ICustomer[];
  products: ILineItem[];
  selectedProducts: ISelectedProduct[];
  setSelectedProducts: (
    products:
      | ISelectedProduct[]
      | ((prev: ISelectedProduct[]) => ISelectedProduct[]),
  ) => void;
  onNext: () => void;
  onPrevious?: () => void;
}

export function SelectProductStep({
  selectedRecipients,
  products,
  selectedProducts,
  setSelectedProducts,
  onNext,
  onPrevious,
}: SelectProductStepProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const total = selectedProducts.reduce((sum, product) => {
    const price =
      product.customPrice !== undefined
        ? product.customPrice
        : product.itemPrice;
    return sum + price * product.quantity;
  }, 0);

  const handleToggleProduct = (product: ILineItem, checked: boolean) => {
    if (!checked) {
      setSelectedProducts((prev) =>
        prev.filter((p) => p.itemCode !== product.itemCode),
      );
    } else {
      setSelectedProducts((prev) => {
        const exists = prev.some((p) => p.itemCode === product.itemCode);
        if (exists) return prev;
        return [...prev, { ...product, quantity: 1 }];
      });
    }
  };

  const handleQuantityChange = (product: ILineItem, quantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.itemCode === product.itemCode ? { ...p, quantity } : p,
      ),
    );
  };

  const handlePriceChange = (product: ILineItem, price: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.itemCode === product.itemCode ? { ...p, customPrice: price } : p,
      ),
    );
  };

  const handleFreeTextChange = (product: ILineItem, freeText: string) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.itemCode === product.itemCode ? { ...p, freeText } : p,
      ),
    );
  };

  const handleRemoveProduct = (product: ISelectedProduct) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.itemCode !== product.itemCode),
    );
  };

  return (
    <VStack gap="space-24">


      {/*<Box>*/}
      {/*    <Heading size="large" level="2" spacing>*/}
      {/*        Velg produkt*/}
      {/*    </Heading>*/}
      {/*</Box>*/}

      {/* Selected Recipients Section */}
      {/*<SelectedRecipientsList*/}
      {/*  selectedRecipients={selectedRecipients}*/}
      {/*  onRemoveRecipient={() => {*/}
      {/*    // Recipients can't be removed from this step*/}
      {/*  }}*/}
      {/*  useExpansionCard={true}*/}
      {/*/>*/}

      {/* Selected Products Section */}
      {/*<SelectedProductsList*/}
      {/*  selectedProducts={selectedProducts}*/}
      {/*  onRemoveProduct={handleRemoveProduct}*/}
      {/*/>*/}

      {/*{selectedProducts.length > 0 && (*/}

      <Box
          paddingBlock="space-6"
          paddingInline="space-0"
          style={{
            borderBottom: "1px solid #e0e0e0",
            marginBottom: "1.5rem",
          }}
      >
        <HStack justify="space-between" align="end">
          <VStack gap="space-2" align="start">
            <Heading size="medium" level="2" spacing>
              Velg produkter:
            </Heading>
            <Detail>
              Bruk søkefunksjonen for å finne produkter.
            </Detail>
          </VStack>

          <HStack gap="space-4" align="center">
            <SelectedRecipientsModal
                selectedRecipients={selectedRecipients}
                showRemoveButton={false}
            />

            <SelectedProductsModal
                selectedProducts={selectedProducts}
                onRemoveProduct={handleRemoveProduct}
                showRemoveButton
            />
          </HStack>
        </HStack>
      </Box>


      <HStack justify="end" align="center" gap="space-6">
        <Heading size="small" level="4" spacing={false}>
          Totalt:
        </Heading>
        <Heading size="small" level="4" spacing={false}>
          {formatPrice(total)}
        </Heading>
      </HStack>

      {/*)}*/}

      {/* Products Table Section */}
      <ProductsTable
        products={products}
        selectedProducts={selectedProducts}
        onToggleProduct={handleToggleProduct}
        onQuantityChange={handleQuantityChange}
        onPriceChange={handlePriceChange}
        onFreeTextChange={handleFreeTextChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <StepNavigation
        onNext={onNext}
        onPrevious={onPrevious}
        nextButtonText="Videre til lagre"
        previousButtonText="Tilbake til mottakere"
        disabled={selectedProducts.length === 0}
      />
    </VStack>
  );
}
