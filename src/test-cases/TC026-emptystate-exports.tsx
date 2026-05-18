import React from "react";
// PF5 test: Uses EmptyStateHeader and EmptyStateIcon as child components.
// In PF6, these exports are removed — use EmptyState's titleText, headingLevel,
// and icon props directly instead of child components.
// Score 3: Remove EmptyStateHeader/EmptyStateIcon, use inline props on EmptyState.
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateHeader } from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";

export const TC026_EmptyStateExports: React.FC = () => (
  <EmptyState>
    <EmptyStateHeader titleText="Empty" headingLevel="h2" icon={<EmptyStateIcon icon={CubesIcon} />} />
    <EmptyStateBody>No data available</EmptyStateBody>
  </EmptyState>
);
