import React from "react";
import { DragDrop, Draggable, Droppable } from "@patternfly/react-core/deprecated";

export const TC018_DragDropDeprecated: React.FC = () => (
  <DragDrop onDrop={() => true}>
    <Droppable>
      <Draggable>Item 1</Draggable>
      <Draggable>Item 2</Draggable>
    </Droppable>
  </DragDrop>
);
