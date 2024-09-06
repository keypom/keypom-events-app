import { extendTheme } from "@chakra-ui/react";

import { colors } from "./colors";
import { config } from "./config";
import { styles } from "./styles";
import { fonts } from "./fonts";

import { ButtonStyle } from "./components/button";
import { ProgressStyle } from "./components/progress";
import { SwitchStyle } from "./components/switch";
import { HeadingStyle } from "./components/heading";
import { TextStyle } from "./components/text";
import { InputStyle } from "./components/input";

export const theme = extendTheme({
  colors,
  config,
  styles,
  fonts,
  components: {
    Button: ButtonStyle,
    Progress: ProgressStyle,
    Switch: SwitchStyle,
    Heading: HeadingStyle,
    Text: TextStyle,
    Input: InputStyle,
  },
});
