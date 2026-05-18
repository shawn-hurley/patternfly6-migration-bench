import React from "react";
import { Nav, NavItem, NavList, PageSection } from "@patternfly/react-core";

export const TC065_PageSectionNavType: React.FC = () => (
  <PageSection type="subnav">
    <Nav>
      <NavList>
        <NavItem to="#">Link</NavItem>
      </NavList>
    </Nav>
  </PageSection>
);
