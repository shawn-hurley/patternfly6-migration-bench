import React from "react";
import { HelperText, HelperTextItem } from "@patternfly/react-core";

export const TC031_HelperTextItemHasIcon: React.FC = () => (
  <HelperText>
    <HelperTextItem variant="success">
      Validation passed
    </HelperTextItem>
    <HelperTextItem variant="error">
      Validation failed
    </HelperTextItem>
  </HelperText>
);
