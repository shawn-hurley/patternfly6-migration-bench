import React from "react";
import { t_global_spacer_300, t_global_text_color_regular } from "@patternfly/react-tokens";

export const TC080_TokensPrefix: React.FC = () => (
  <div style={{ padding: t_global_spacer_300.value, color: t_global_text_color_regular.value }}>
    Content using PF5 token values
  </div>
);
