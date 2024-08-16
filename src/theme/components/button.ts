import { defineStyleConfig } from "@chakra-ui/react";

export const ButtonStyle = defineStyleConfig({
  variants: {
    transparent: {
      bg: "transparent",
      color: "brand.400",
      _hover: {
        bg: "transparent",
        color: "brand.400",
      },
      _active: {
        bg: "transparent",
        color: "brand.400",
      },
    },
    navigation: {
      bg: "brand.400",
      color: "black",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem 1.5rem",
      gap: 2,
      flex: "1 0 0",
      borderRadius: "md",
      fontFamily: "mono",
      textAlign: "center",
      textTransform: "uppercase",
      fontSize: "xs",
      fontWeight: "bold",
      lineHeight: "1rem",
      fontStretch: "condensed",
    },
  },
});
