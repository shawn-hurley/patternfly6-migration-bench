import React from "react";
import { EmptyState, EmptyStateBody } from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";

export const TC026_EmptyStateExports: React.FC = () => (
  <EmptyState titleText="Empty" headingLevel="h2" icon={CubesIcon}>
    <EmptyStateBody>No data available</EmptyStateBody>
  </EmptyState>
);
