import React from "react";
// PF5 test: PageSection with type="nav" — the 'nav' type was removed in PF6.
// Valid migrations: remove the type prop entirely (falls back to 'default'),
// or use type="subnav" if the section contains subnav content.
// Score 3 for removing type="nav" or replacing with type="subnav".
// Note: pf-codemods also adds hasBodyWrapper={false} — this is optional but valid.
import { Nav, NavItem, NavList, PageSection } from "@patternfly/react-core";

export const TC065_PageSectionNavType: React.FC = () => (
  <PageSection type="nav">
    <Nav>
      <NavList>
        <NavItem to="#">Link</NavItem>
      </NavList>
    </Nav>
  </PageSection>
);
