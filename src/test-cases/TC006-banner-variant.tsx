import React from "react";
import { Banner } from "@patternfly/react-core";
export const TC006_BannerVariant: React.FC = () => (
  <div>
    <Banner color="gold">Warning banner</Banner>
    <Banner color="red">Danger banner</Banner>
    <Banner color="blue">Info banner</Banner>
    <Banner color="green">Success banner</Banner>
  </div>
);
