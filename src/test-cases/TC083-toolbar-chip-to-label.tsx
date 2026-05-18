import React from "react";
import { Toolbar, ToolbarContent, ToolbarFilter, ToolbarItem } from "@patternfly/react-core";

export const TC083_ToolbarChipToLabel: React.FC = () => (
  <Toolbar>
    <ToolbarContent>
      <ToolbarFilter
        labels={["Chip 1", "Chip 2"]}
        deleteLabel={() => {}}
        deleteLabelGroup={() => {}}
        categoryName="Status"
      >
        <ToolbarItem>Filter content</ToolbarItem>
      </ToolbarFilter>
    </ToolbarContent>
  </Toolbar>
);
