import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionToggle } from "@patternfly/react-core";

export const TC003_AccordionToggleIsExpanded: React.FC = () => {
  const [expanded, setExpanded] = React.useState(true);
  return (
    <Accordion>
      <AccordionItem isExpanded={expanded}>
        <AccordionToggle onClick={() => setExpanded(!expanded)} id="tc003-toggle">
          Toggle
        </AccordionToggle>
        <AccordionContent>Content</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
