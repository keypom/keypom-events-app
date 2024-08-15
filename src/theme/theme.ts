import { extendTheme } from "@chakra-ui/react";

import { colors } from "./colors";
import { config } from "./config";
import { styles } from "./styles";

export const theme = extendTheme({
  colors,
  config,
  styles,
});
