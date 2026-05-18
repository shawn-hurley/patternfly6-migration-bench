import React from "react";
import { Select, SelectOption, SelectList, MenuToggle, MenuToggleElement } from "@patternfly/react-core";

export const TC070_PopperAppendTo: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelected(value as string);
    setIsOpen(false);
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle ref={toggleRef} onClick={onToggle} isExpanded={isOpen}>
      {selected || "Select an option"}
    </MenuToggle>
  );

  return (
    <Select
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={setIsOpen}
      toggle={toggle}
      selected={selected}
    >
      <SelectList>
        <SelectOption value="Option 1">Option 1</SelectOption>
        <SelectOption value="Option 2">Option 2</SelectOption>
      </SelectList>
    </Select>
  );
};
