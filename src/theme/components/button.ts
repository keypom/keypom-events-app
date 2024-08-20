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
    redacted: {
      display: "flex",
      maxWidth: "300px",
      width: "100%",
      padding: "2rem 0",
      justifyContent: "center",
      alignItems: "center",
      gap: 4,
      borderRadius: "md",
      border: "2px solid var(--chakra-colors-brand-400)",
      color: "white",
      textAlign: "center",
      fontFamily: "mono",
      fontSize: "2xl",
      fontWeight: "medium",
      textTransform: "uppercase",
      position: "relative",
      _before: {
        content: '""',
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "url(/redacted-button.webp) black 50% / cover no-repeat",
        opacity: 0.5,
        top: 0,
        left: 0,
        zIndex: -1,
      },
    },
    navigation: {
      display: "flex",
      bg: "brand.400",
      color: "black",
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
