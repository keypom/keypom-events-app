import { extendTheme } from "@chakra-ui/react";

import { colors } from "./colors";
import { config } from "./config";
import { styles } from "./styles";
import { fonts } from "./fonts";
import { breakpoints } from "./breakpoints";

import { ButtonStyle } from "./components/button";
import { ProgressStyle } from "./components/progress";
import { SwitchStyle } from "./components/switch";

export const theme = extendTheme({
  colors,
  config,
  styles,
  fonts,
  breakpoints,
  components: {
    Button: ButtonStyle,
    Progress: ProgressStyle,
    Switch: SwitchStyle,
  },
});
