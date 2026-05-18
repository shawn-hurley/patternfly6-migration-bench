import React from "react";
// PF5 test: Uses EmptyStateIcon and Title as children of EmptyState.
// In PF6, move icon to EmptyState's icon prop, title text to titleText prop (as a string),
// and headingLevel to EmptyState's headingLevel prop. Remove Title and EmptyStateIcon.
// Score 3: titleText should be a plain string, not a <Title> JSX element.
import { EmptyState, EmptyStateBody, EmptyStateIcon } from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";
import { Title } from "@patternfly/react-core";

export const TC027_EmptyStateHeader: React.FC = () => (
  <EmptyState>
    <EmptyStateIcon icon={SearchIcon} />
    <Title headingLevel="h2" size="lg">No results found</Title>
    <EmptyStateBody>Try adjusting your search.</EmptyStateBody>
  </EmptyState>
);
