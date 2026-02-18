import { useState } from "react";
import { List, Modal, Button } from "@navikt/ds-react";
import { TrashIcon, PackageIcon } from "@navikt/aksel-icons";
import type { ISelectedProduct } from "~/types/product";
import { formatPrice } from "~/utils/variousFormats";

interface SelectedProductsModalProps {
    selectedProducts: ISelectedProduct[];
    onRemoveProduct?: (product: ISelectedProduct) => void;
    showRemoveButton?: boolean;
}

export function SelectedProductsModal({
                                          selectedProducts,
                                          onRemoveProduct,
                                          showRemoveButton = true,
                                      }: SelectedProductsModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Button lives here */}
            <Button
                variant="secondary"
                size="small"
                disabled={selectedProducts.length === 0}
                onClick={() => setOpen(true)}
                icon={<PackageIcon aria-hidden fontSize="1.5rem" />}
            >
                {selectedProducts.length} produkt
                {selectedProducts.length !== 1 ? "er" : ""} valgt
            </Button>

            {/* Modal */}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                header={{ heading: "Valgte produkter" }}
                width="medium"
                closeOnBackdropClick
            >
                <Modal.Body>
                    <List as="ul">
                        {selectedProducts.map((product) => {
                            const unitPrice =
                                product.customPrice !== undefined
                                    ? product.customPrice
                                    : product.itemPrice;

                            const total = unitPrice * product.quantity;

                            return (
                                <List.Item
                                    key={product.itemCode}
                                    icon={showRemoveButton ? <TrashIcon aria-hidden /> : undefined}
                                    title={`${product.description} (${product.itemCode})`}
                                    onClick={
                                        showRemoveButton ? () => onRemoveProduct?.(product) : undefined
                                    }
                                >
                                    {product.freeText && `Fritekst: ${product.freeText} - `}
                                    Pris pr. enhet: {formatPrice(unitPrice)} - Antall:{" "}
                                    {product.quantity} - Sum: {formatPrice(total)}
                                </List.Item>
                            );
                        })}
                    </List>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SelectedProductsModal;
