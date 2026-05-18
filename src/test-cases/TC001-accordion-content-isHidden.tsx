import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionToggle } from "@patternfly/react-core";

export const TC001_AccordionContentIsHidden: React.FC = () => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <Accordion>
      <AccordionItem isExpanded={expanded}>
        <AccordionToggle onClick={() => setExpanded(!expanded)} id="tc001-toggle">
          Item One
        </AccordionToggle>
        <AccordionContent>
          Content for item one.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
