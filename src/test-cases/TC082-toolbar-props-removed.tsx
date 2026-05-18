import React from "react";
import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";

// alignment and widths props don't exist in PF5 ToolbarItem - simulating what would be migrated
export const TC082_ToolbarPropsRemoved: React.FC = () => (
  <Toolbar>
    <ToolbarContent>
      <ToolbarItem>
        Item
      </ToolbarItem>
    </ToolbarContent>
  </Toolbar>
);
