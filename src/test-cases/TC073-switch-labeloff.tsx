import React from "react";
import { Switch } from "@patternfly/react-core";

export const TC073_SwitchLabelOff: React.FC = () => (
  <Switch
    id="tc073-switch"
    label="Enabled"

    isChecked={false}
    onChange={() => {}}
  />
);
