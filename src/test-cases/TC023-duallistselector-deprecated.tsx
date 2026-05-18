import React from "react";
import {
  DualListSelector,
  DualListSelectorPane,
  DualListSelectorList,
  DualListSelectorListItem,
  DualListSelectorControlsWrapper,
  DualListSelectorControl,
} from "@patternfly/react-core";
import AngleDoubleLeftIcon from "@patternfly/react-icons/dist/esm/icons/angle-double-left-icon";
import AngleLeftIcon from "@patternfly/react-icons/dist/esm/icons/angle-left-icon";
import AngleDoubleRightIcon from "@patternfly/react-icons/dist/esm/icons/angle-double-right-icon";
import AngleRightIcon from "@patternfly/react-icons/dist/esm/icons/angle-right-icon";

export const TC023_DualListSelectorDeprecated: React.FC = () => (
  <DualListSelector>
    <DualListSelectorPane>
      <DualListSelectorList>
        <DualListSelectorListItem>Option 1</DualListSelectorListItem>
        <DualListSelectorListItem>Option 2</DualListSelectorListItem>
        <DualListSelectorListItem>Option 3</DualListSelectorListItem>
      </DualListSelectorList>
    </DualListSelectorPane>
    <DualListSelectorControlsWrapper>
      <DualListSelectorControl icon={<AngleDoubleRightIcon />} />
      <DualListSelectorControl icon={<AngleRightIcon />} />
      <DualListSelectorControl icon={<AngleLeftIcon />} />
      <DualListSelectorControl icon={<AngleDoubleLeftIcon />} />
    </DualListSelectorControlsWrapper>
    <DualListSelectorPane isChosen>
      <DualListSelectorList>
        <DualListSelectorListItem>Option 4</DualListSelectorListItem>
      </DualListSelectorList>
    </DualListSelectorPane>
  </DualListSelector>
);
