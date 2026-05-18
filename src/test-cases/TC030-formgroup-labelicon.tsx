import React from "react";
import { FormGroup, Popover, TextInput } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export const TC030_FormGroupLabelIcon: React.FC = () => (
  <FormGroup
    label="Full name"
    labelHelp={
      <Popover bodyContent="Enter your full legal name">
        <button aria-label="Help">
          <HelpIcon />
        </button>
      </Popover>
    }
  >
    <TextInput id="tc030-input" />
  </FormGroup>
);
