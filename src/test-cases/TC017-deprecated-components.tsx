import React from "react";
import { Dropdown, DropdownItem, DropdownList, MenuToggle, MenuToggleElement } from "@patternfly/react-core";

export const TC017_DeprecatedComponents: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle ref={toggleRef} onClick={() => setIsOpen(!isOpen)} isExpanded={isOpen}>
          Dropdown
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem key="item1">Item 1</DropdownItem>
        <DropdownItem key="item2">Item 2</DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};
