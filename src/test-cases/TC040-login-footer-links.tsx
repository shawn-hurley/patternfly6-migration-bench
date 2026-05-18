import React from "react";
import { LoginMainFooterLinksItem } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";

export const TC040_LoginFooterLinks: React.FC = () => (
  <LoginMainFooterLinksItem>
    <a href="https://example.com" target="_blank" aria-label="Help link">
      <ExternalLinkAltIcon />
    </a>
  </LoginMainFooterLinksItem>
);
