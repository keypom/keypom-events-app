import { defineStyleConfig } from "@chakra-ui/react";
export const SwitchStyle = defineStyleConfig({
  baseStyle: {
    track: {
      bg: "black",
      padding: "2px",
      border: "1px solid",
      borderColor: "brand.400",
      borderRadius: "xl",
      _checked: {
        bg: "brand.400",
      },
    },
    container: {},
    thumb: {},
  },
});
