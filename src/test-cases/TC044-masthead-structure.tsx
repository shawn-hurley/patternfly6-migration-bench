import React from "react";
import { Brand, Button, Masthead, MastheadBrand, MastheadContent, MastheadLogo, MastheadMain, MastheadToggle } from "@patternfly/react-core";
import { BarsIcon } from "@patternfly/react-icons";

export const TC044_MastheadStructure: React.FC = () => (
  <Masthead>
    <MastheadToggle>
      <Button variant="plain" aria-label="Toggle" icon={<BarsIcon />} />
    </MastheadToggle>
    <MastheadMain>
      <MastheadBrand>
        <MastheadLogo>
          <Brand src="/logo.svg" alt="Logo" />
        </MastheadLogo>
      </MastheadBrand>
    </MastheadMain>
    <MastheadContent>Content</MastheadContent>
  </Masthead>
);
