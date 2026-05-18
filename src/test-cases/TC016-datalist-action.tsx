import React from "react";
import { DataList, DataListAction, DataListCell, DataListItem, DataListItemRow, Button } from "@patternfly/react-core";

export const TC016_DataListAction: React.FC = () => (
  <DataList aria-label="data list">
    <DataListItem>
      <DataListItemRow>
        <DataListCell key="cell">Cell</DataListCell>
        <DataListAction id="action1" aria-label="actions" aria-labelledby="action1">
          <Button variant="plain">Action</Button>
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  </DataList>
);
