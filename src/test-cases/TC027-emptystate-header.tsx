import React from "react";
// PF5 test: Uses EmptyStateIcon and Title as children of EmptyState.
// In PF6, move icon to EmptyState's icon prop, title text to titleText prop (as a string),
// and headingLevel to EmptyState's headingLevel prop. Remove Title and EmptyStateIcon.
// Score 3: titleText should be a plain string, not a <Title> JSX element.
import { EmptyState, EmptyStateBody } from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

export const TC027_EmptyStateHeader: React.FC = () => (
  <EmptyState icon={SearchIcon} titleText="No results found" headingLevel="h2">
    <EmptyStateBody>Try adjusting your search.</EmptyStateBody>
  </EmptyState>
);
