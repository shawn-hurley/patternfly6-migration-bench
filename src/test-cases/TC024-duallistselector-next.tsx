import React from "react";
// PF5 test: DualListSelector uses the old prop-based API (availableOptions/chosenOptions).
// In PF6, this should be migrated to the composable API (DualListSelectorPane/List/ListItem)
// imported from @patternfly/react-core (promoted from /next).
// pf-codemods moves to /deprecated instead — the composable migration is the preferred path.
// Score 3 for either approach (composable API or deprecated import).
import { DualListSelector } from "@patternfly/react-core";

export const TC024_DualListSelectorNext: React.FC = () => (
  <DualListSelector
    availableOptions={["Alpha", "Beta"]}
    chosenOptions={["Gamma"]}
  />
);
