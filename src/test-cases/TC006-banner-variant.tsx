import React from "react";
import { Banner } from "@patternfly/react-core";

// In PF5, Banner uses "variant" with values: "default", "blue", "red", "green", "gold"
// PF6 replaces color with color prop and renames gold→yellow
export const TC006_BannerVariant: React.FC = () => (
  <div>
    <Banner color="gold">Warning banner</Banner>
    <Banner color="red">Danger banner</Banner>
    <Banner color="blue">Info banner</Banner>
    <Banner color="green">Success banner</Banner>
  </div>
);
