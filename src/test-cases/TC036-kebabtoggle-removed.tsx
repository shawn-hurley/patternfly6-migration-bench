import React from "react";
import { Dropdown, DropdownList, MenuToggle } from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";

export const TC036_KebabToggleRemoved: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dropdown
      isOpen={isOpen}
      isPlain
      onOpenChange={setIsOpen}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          variant="plain"
          onClick={() => setIsOpen(!isOpen)}
          isExpanded={isOpen}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
    >
      <DropdownList>{/* items go here */}</DropdownList>
    </Dropdown>
  );
};
