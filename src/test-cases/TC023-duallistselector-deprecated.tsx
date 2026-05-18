import React from "react";
import {
  DualListSelector,
  DualListSelectorPane,
  DualListSelectorList,
  DualListSelectorListItem,
  DualListSelectorControlsWrapper,
} from "@patternfly/react-core";

export const TC023_DualListSelectorDeprecated: React.FC = () => (
  <DualListSelector>
    <DualListSelectorPane>
      <DualListSelectorList>
        <DualListSelectorListItem>Option 1</DualListSelectorListItem>
        <DualListSelectorListItem>Option 2</DualListSelectorListItem>
        <DualListSelectorListItem>Option 3</DualListSelectorListItem>
      </DualListSelectorList>
    </DualListSelectorPane>
    <DualListSelectorControlsWrapper />
    <DualListSelectorPane isChosen>
      <DualListSelectorList>
        <DualListSelectorListItem>Option 4</DualListSelectorListItem>
      </DualListSelectorList>
    </DualListSelectorPane>
  </DualListSelector>
);
