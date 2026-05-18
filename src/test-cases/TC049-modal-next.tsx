import React from "react";
import { Button } from "@patternfly/react-core";
import { Modal, ModalVariant, ModalHeader } from "@patternfly/react-core";

export const TC049_ModalNext: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal variant={ModalVariant.small} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader title="Modal" />
        Content
      </Modal>
    </>
  );
};
