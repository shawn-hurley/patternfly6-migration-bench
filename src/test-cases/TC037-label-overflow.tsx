import React from "react";
import { Label, LabelGroup } from "@patternfly/react-core";

export const TC037_LabelOverflow: React.FC = () => (
  <LabelGroup>
    <Label>Label 1</Label>
    <Label>Label 2</Label>
    <Label variant="overflow">3 more</Label>
  </LabelGroup>
);
