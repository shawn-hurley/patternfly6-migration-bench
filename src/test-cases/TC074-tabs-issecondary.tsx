import React from "react";
import { Tab, TabTitleText, Tabs } from "@patternfly/react-core";

export const TC074_TabsIsSecondary: React.FC = () => (
  <Tabs isSubtab activeKey={0}>
    <Tab eventKey={0} title={<TabTitleText>Tab 1</TabTitleText>}>Content 1</Tab>
    <Tab eventKey={1} title={<TabTitleText>Tab 2</TabTitleText>}>Content 2</Tab>
  </Tabs>
);
