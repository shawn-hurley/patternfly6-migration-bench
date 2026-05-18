import React from "react";
import { LogSnippet } from "@patternfly/react-component-groups";

export const TC038_LogSnippetVariant: React.FC = () => (
  <LogSnippet
    message="Error occurred during build"
    logSnippet="ERROR: Build failed at step 3"
    variant="danger"
  />
);
