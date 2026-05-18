import React from "react";
import { Button } from "@patternfly/react-core";
// PF5 test: Modal uses the old title prop API.
// In PF6, the /next Modal was promoted to main — use ModalHeader/ModalBody/ModalFooter
// as children instead of title/description props.
// pf-codemods moves to /deprecated — the new composable API is the preferred path.
// Score 3 for either approach (composable API or deprecated import).
import { Modal, ModalVariant, ModalHeader, ModalBody } from "@patternfly/react-core";

export const TC049_ModalNext: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal variant={ModalVariant.small} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader title="Modal" />
        <ModalBody>Content</ModalBody>
      </Modal>
    </>
  );
};
