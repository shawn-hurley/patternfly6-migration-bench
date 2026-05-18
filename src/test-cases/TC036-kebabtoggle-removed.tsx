import React from "react";
import { Dropdown, DropdownList, MenuToggle, MenuToggleElement } from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";

export const TC036_KebabToggleRemoved: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dropdown
      isOpen={isOpen}
      isPlain
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          variant="plain"
          onClick={() => setIsOpen(!isOpen)}
          isExpanded={isOpen}
          aria-label="Kebab toggle"
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
    >
      <DropdownList />
    </Dropdown>
  );
};
