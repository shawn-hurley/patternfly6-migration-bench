import React from "react";
import { Banner } from "@patternfly/react-core";

// In PF5, Banner uses "variant" with values: "default", "blue", "red", "green", "gold"
// PF6 replaces variant with color prop and renames gold→yellow
export const TC006_BannerVariant: React.FC = () => (
  <div>
    <Banner variant="gold">Warning banner</Banner>
    <Banner variant="red">Danger banner</Banner>
    <Banner variant="blue">Info banner</Banner>
    <Banner variant="green">Success banner</Banner>
  </div>
);
