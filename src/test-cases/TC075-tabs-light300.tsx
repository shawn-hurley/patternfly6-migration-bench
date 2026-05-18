import React from "react";
import { Tab, TabTitleText, Tabs } from "@patternfly/react-core";

export const TC075_TabsLight300: React.FC = () => (
  <Tabs variant="secondary" activeKey={0}>
    <Tab eventKey={0} title={<TabTitleText>Tab 1</TabTitleText>}>Content 1</Tab>
  </Tabs>
);
