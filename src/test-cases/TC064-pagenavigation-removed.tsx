import React from "react";
import { Nav, NavItem, NavList, Page, PageSection } from "@patternfly/react-core";

export const TC064_PageNavigationRemoved: React.FC = () => (
  <Page>
    <Nav>
      <NavList>
        <NavItem to="#">Link</NavItem>
      </NavList>
    </Nav>
    <PageSection>Content</PageSection>
  </Page>
);
