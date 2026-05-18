import React from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@patternfly/react-core";

export const TC009_CardRaisedProps: React.FC = () => (
  <Card isSelectable>
    <CardHeader
      selectableActions={{
        selectableActionId: "selectable-card-input",
        selectableActionAriaLabelledby: "selectable-card-title",
        name: "selectable-card",
        onChange: () => {},
      }}
    >
      <CardTitle id="selectable-card-title">Selectable Card</CardTitle>
    </CardHeader>
    <CardBody>Card content</CardBody>
  </Card>
);
