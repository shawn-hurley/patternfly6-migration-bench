import React from "react";
import { Brand, Masthead, MastheadBrand, MastheadContent, MastheadLogo, MastheadMain } from "@patternfly/react-core";

export const TC042_MastheadBrandLogo: React.FC = () => (
  <Masthead>
    <MastheadMain>
      <MastheadBrand>
        <MastheadLogo>
          <Brand src="/logo.svg" alt="Logo" />
        </MastheadLogo>
      </MastheadBrand>
    </MastheadMain>
    <MastheadContent>Header content</MastheadContent>
  </Masthead>
);
