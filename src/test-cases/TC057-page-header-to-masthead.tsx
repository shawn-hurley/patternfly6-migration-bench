import React from "react";
import { Masthead, MastheadContent, Page, PageSection } from "@patternfly/react-core";

const header = (
  <Masthead>
    <MastheadContent>Header</MastheadContent>
  </Masthead>
);

export const TC057_PageHeaderToMasthead: React.FC = () => (
  <Page masthead={header}>
    <PageSection>Page content</PageSection>
  </Page>
);
