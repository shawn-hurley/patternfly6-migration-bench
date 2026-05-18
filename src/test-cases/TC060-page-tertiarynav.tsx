import React from "react";
import { Nav, NavItem, NavList, Page, PageSection } from "@patternfly/react-core";

const tertiaryNav = (
  <Nav variant="horizontal-subnav">
    <NavList>
      <NavItem to="#">Sub 1</NavItem>
      <NavItem to="#">Sub 2</NavItem>
    </NavList>
  </Nav>
);

export const TC060_PageTertiaryNav: React.FC = () => (
  <Page horizontalSubnav={tertiaryNav}>
    <PageSection>Content</PageSection>
  </Page>
);
