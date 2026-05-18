import React from "react";
import { Nav, NavItem, NavList } from "@patternfly/react-core";

export const TC051_NavTertiary: React.FC = () => (
  <Nav variant="horizontal-subnav">
    <NavList>
      <NavItem to="#">Tab 1</NavItem>
      <NavItem to="#">Tab 2</NavItem>
    </NavList>
  </Nav>
);
