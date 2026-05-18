import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from "@patternfly/react-core";

export const TC048_ModalDeprecated: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal
        variant={ModalVariant.small}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ModalHeader title="Modal title" />
        <ModalBody>
          Modal body content
        </ModalBody>
        <ModalFooter>
          <Button key="confirm" variant="primary" onClick={() => setIsOpen(false)}>Confirm</Button>
          <Button key="cancel" variant="link" onClick={() => setIsOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
