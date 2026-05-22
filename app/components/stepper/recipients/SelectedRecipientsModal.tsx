import { useState } from "react";
import { List, Modal, Button } from "@navikt/ds-react";
import type { ICustomer } from "~/types/group";
import { TrashIcon, ChildHairEyesIcon } from "@navikt/aksel-icons";

interface SelectedRecipientsModalProps {
    selectedRecipients: ICustomer[];
    onRemoveRecipient?: (customer: ICustomer) => void;
    showRemoveButton?: boolean;
}

export function SelectedRecipientsModal({
                                            selectedRecipients,
                                            onRemoveRecipient,
                                            showRemoveButton,
                                        }: SelectedRecipientsModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Button lives here */}
            <Button
                variant="secondary"
                size="small"
                disabled={selectedRecipients.length === 0}
                onClick={() => setOpen(true)}
                icon={<ChildHairEyesIcon aria-hidden fontSize="1.5rem" />}
            >
                {selectedRecipients.length} mottaker
                {selectedRecipients.length !== 1 ? "e" : ""} valgt
            </Button>

            {/* Modal */}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                header={{ heading: "Valgte mottakere" }}
                width="medium"
                closeOnBackdropClick
            >
                <Modal.Body>
                    <List as="ul">
                        {selectedRecipients.map((person) => (
                            <List.Item
                                key={person.id}
                                icon={showRemoveButton ? <TrashIcon aria-hidden /> : undefined}
                                onClick={
                                    showRemoveButton
                                        ? () => onRemoveRecipient?.(person)
                                        : undefined
                                }
                            >
                                {person.name}
                            </List.Item>
                        ))}
                    </List>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SelectedRecipientsModal;
