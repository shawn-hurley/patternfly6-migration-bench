import React from "react";
import { Content, ContentVariants } from "@patternfly/react-core";

export const TC077_TextToContent: React.FC = () => (
  <Content>
    <Content component={ContentVariants.h1}>Heading</Content>
    <Content component={ContentVariants.p}>Paragraph text</Content>
    <Content component="ul">
      <Content component="li">Item 1</Content>
      <Content component="li">Item 2</Content>
    </Content>
  </Content>
);
