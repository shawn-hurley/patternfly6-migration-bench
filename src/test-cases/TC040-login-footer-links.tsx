import React from "react";
import { LoginMainFooterLinksItem } from "@patternfly/react-core/deprecated";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";

export const TC040_LoginFooterLinks: React.FC = () => (
  <LoginMainFooterLinksItem href="https://example.com" target="_blank" linkComponentProps={{ "aria-label": "Help link" }}>
    <ExternalLinkAltIcon />
  </LoginMainFooterLinksItem>
);
