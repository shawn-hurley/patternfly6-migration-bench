import React from "react";
import { Page, PageSection } from "@patternfly/react-core";

export const TC062_PageSectionBodyWrapper: React.FC = () => (
  <Page>
    <PageSection variant="default" isWidthLimited>
      Width-limited section
    </PageSection>
    <PageSection>Default section</PageSection>
  </Page>
);
