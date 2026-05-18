import React from "react";
import { UnauthorizedAccess } from "@patternfly/react-component-groups";

export const TC054_NotAuthorizedProps: React.FC = () => (
  <UnauthorizedAccess
    titleText="Access denied"
    bodyText="You do not have permission to view this page."
  />
);
