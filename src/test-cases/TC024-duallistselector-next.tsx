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

export const TC024_DualListSelectorNext: React.FC = () => (
  <DualListSelector>
    <DualListSelectorPane>
      <DualListSelectorList>
        <DualListSelectorListItem>Alpha</DualListSelectorListItem>
        <DualListSelectorListItem>Beta</DualListSelectorListItem>
      </DualListSelectorList>
    </DualListSelectorPane>
    <DualListSelectorControlsWrapper>
      <DualListSelectorControl icon={<AngleDoubleRightIcon />} tooltipContent="Add all" />
      <DualListSelectorControl icon={<AngleRightIcon />} tooltipContent="Add selected" />
      <DualListSelectorControl icon={<AngleLeftIcon />} tooltipContent="Remove selected" />
      <DualListSelectorControl icon={<AngleDoubleLeftIcon />} tooltipContent="Remove all" />
    </DualListSelectorControlsWrapper>
    <DualListSelectorPane isChosen>
      <DualListSelectorList>
        <DualListSelectorListItem>Gamma</DualListSelectorListItem>
      </DualListSelectorList>
    </DualListSelectorPane>
  </DualListSelector>
);
