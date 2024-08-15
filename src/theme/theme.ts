import { extendTheme } from "@chakra-ui/react";

import { colors } from "./colors";
import { config } from "./config";

export const theme = extendTheme({
  colors,
  config,
});
