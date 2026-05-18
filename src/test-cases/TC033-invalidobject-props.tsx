import React from "react";
import { MissingPage } from "@patternfly/react-component-groups";

export const TC033_InvalidObjectProps: React.FC = () => (
  <MissingPage
    titleText="Page not found"
    bodyText="The requested page could not be found."
  />
);
