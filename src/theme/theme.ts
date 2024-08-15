import { extendTheme } from "@chakra-ui/react";

import { colors } from "./colors";
import { config } from "./config";
import { styles } from "./styles";

import { ButtonStyle } from "./components/button";

export const theme = extendTheme({
  colors,
  config,
  styles,
  components: {
    Button: ButtonStyle,
  },
});
