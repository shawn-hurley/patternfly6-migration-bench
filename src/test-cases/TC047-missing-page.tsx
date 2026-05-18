import React from "react";
import { MissingPage } from "@patternfly/react-component-groups";

export const TC047_MissingPage: React.FC = () => (
  <MissingPage
    titleText="Page not found"
    bodyText="The page you are looking for does not exist."
  />
);
