import { defineStyleConfig } from "@chakra-ui/react";

// Common Styles
const FLEX_CENTER = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const MONO_FONT = {
  fontFamily: "mono",
  textTransform: "uppercase",
};

// Button Variants
const transparentVariant = {
  bg: "transparent",
  color: "brand.400",
  padding: 0,
  _hover: {
    bg: "transparent",
    color: "brand.400",
  },
  _active: {
    bg: "transparent",
    color: "brand.400",
  },
};

const secondaryVariant = {
  ...FLEX_CENTER,
  width: "100%",
  padding: "2rem 0",
  gap: 4,
  borderRadius: "md",
  border: "2px solid var(--chakra-colors-brand-400)",
  color: "white",
  textAlign: "center",
  ...MONO_FONT,
  fontSize: "2xl",
  fontWeight: "medium",
  position: "relative",
  _before: {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",
    background:
      "url(/assets/custom-button-bg.webp) black 50% / cover no-repeat",
    opacity: 0.5,
    top: 0,
    left: 0,
    zIndex: -1,
  },
};

const primaryVariant = {
  ...FLEX_CENTER,
  bg: "brand.400",
  color: "black",
  flexDirection: "column",
  height: "100%",
  padding: "1rem 1.5rem",
  gap: 2,
  flex: "1 0 0",
  borderRadius: "md",
  textAlign: "center",
  ...MONO_FONT,
  fontSize: "xs",
  fontWeight: "bold",
  lineHeight: "1rem",
  fontStretch: "condensed",
  _hover: {
    bg: "brand.600 !important",
  },
  _active: {
    bg: "bg.primary",
    color: "brand.400",
  },
  _disabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  }
};

const outlineVariant = {
  ...FLEX_CENTER,
  bg: "transparent",
  color: "brand.400",
  flexDirection: "column",
  height: "100%",
  padding: "1rem 1.5rem",
  gap: 2,
  flex: "1 0 0",
  borderRadius: "md",
  borderColor: "brand.400",
  textAlign: "center",
  ...MONO_FONT,
  fontSize: "xs",
  fontWeight: "bold",
  lineHeight: "1rem",
  fontStretch: "condensed",
};

const dangerVariant = {
  ...FLEX_CENTER,
  bg: "red.400",
  color: "white",
  flexDirection: "column",
  height: "100%",
  padding: "1rem 1.5rem",
  gap: 2,
  flex: "1 0 0",
  borderRadius: "md",
  textAlign: "center",
  ...MONO_FONT,
  fontSize: "xs",
  fontWeight: "bold",
  lineHeight: "1rem",
  fontStretch: "condensed",
  _hover: {
    background: "red.600",
  },
};

export const ButtonStyle = defineStyleConfig({
  variants: {
    transparent: transparentVariant,
    primary: primaryVariant,
    secondary: secondaryVariant,
    outline: outlineVariant,
    danger: dangerVariant,
  },
});
