import React from "react";
import { Nav, NavItem, NavList } from "@patternfly/react-core";
import { HomeIcon } from "@patternfly/react-icons";

export const TC053_NavItemWrapper: React.FC = () => (
  <Nav>
    <NavList>
      <NavItem to="#">
        <HomeIcon /> Home
      </NavItem>
    </NavList>
  </Nav>
);
