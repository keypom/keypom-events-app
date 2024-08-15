import { defineStyleConfig } from "@chakra-ui/react";

export const ButtonStyle = defineStyleConfig({
  variants: {
    navigation: {
      bg: "brand.400",
      color: "black",
      flex: 1,
      padding: "1rem",
      _hover: {
        bg: "brand.500",
      },
    },
  },
});
