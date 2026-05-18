import React from "react";
import { Card, CardTitle, CardBody } from "@patternfly/react-core";

export const TC079_TileDeprecated: React.FC = () => (
  <div>
    <Card variant="secondary" isSelected>
      <CardTitle>Tile 1</CardTitle>
      <CardBody>Content 1</CardBody>
    </Card>
    <Card variant="secondary">
      <CardTitle>Tile 2</CardTitle>
      <CardBody>Content 2</CardBody>
    </Card>
  </div>
);
