import React from "react";
import { MenuToggle } from "@patternfly/react-core";
import { CogIcon } from "@patternfly/react-icons";

export const TC046_MenuToggleIcon: React.FC = () => (
  <MenuToggle icon={<CogIcon />}>Settings</MenuToggle>
);
