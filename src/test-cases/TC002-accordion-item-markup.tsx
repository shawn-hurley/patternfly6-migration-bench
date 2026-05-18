import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionToggle } from "@patternfly/react-core";

export const TC002_AccordionItemMarkup: React.FC = () => (
  <Accordion>
    <AccordionItem isExpanded={false}>
      <AccordionToggle id="tc002-toggle" onClick={() => {}}>
        Item
      </AccordionToggle>
      <AccordionContent>Content</AccordionContent>
    </AccordionItem>
  </Accordion>
);
