import React from "react";
import { Label, LabelGroup } from "@patternfly/react-core";

export const TC013_ChipToLabel: React.FC = () => (
  <LabelGroup categoryName="Colors">
    <Label onClick={() => {}}>Red</Label>
    <Label onClick={() => {}}>Blue</Label>
  </LabelGroup>
);
