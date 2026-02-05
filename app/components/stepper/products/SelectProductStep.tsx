import { Heading, Box, VStack } from "@navikt/ds-react";
import { useState } from "react";
import { SelectedRecipientsList } from "../recipients/SelectedRecipientsList";
import { SelectedProductsList } from "./SelectedProductsList";
import { ProductsTable } from "./ProductsTable";
import { StepNavigation } from "../StepNavigation";
import type { ICustomer } from "~/types/group";
import type { ILineItem, ISelectedProduct } from "~/types/product";

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
    <VStack gap="6">
      {/*<Box>*/}
      {/*    <Heading size="large" level="2" spacing>*/}
      {/*        Velg produkt*/}
      {/*    </Heading>*/}
      {/*</Box>*/}

      {/* Selected Recipients Section */}
      <SelectedRecipientsList
        selectedRecipients={selectedRecipients}
        onRemoveRecipient={() => {
          // Recipients can't be removed from this step
        }}
        useExpansionCard={true}
      />

      {/* Selected Products Section */}
      <SelectedProductsList
        selectedProducts={selectedProducts}
        onRemoveProduct={handleRemoveProduct}
      />

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
