import React from "react";
import { PageSection } from "@patternfly/react-core";

export const TC066_PageSectionVariant: React.FC = () => (
  <div>
    <PageSection variant="default">Light section</PageSection>
    <PageSection variant="secondary">Dark section</PageSection>
    <PageSection variant="secondary">Darker section</PageSection>
  </div>
);
