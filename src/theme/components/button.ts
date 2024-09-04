import { defineStyleConfig } from "@chakra-ui/react";

// Common Styles
const TRANSPARENT_STYLE = {
  bg: "transparent",
  color: "brand.400",
};

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
  ...TRANSPARENT_STYLE,
  padding: 0,
  _hover: TRANSPARENT_STYLE,
  _active: TRANSPARENT_STYLE,
};

const customVariant = {
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
    background: "url(/redacted-button.webp) black 50% / cover no-repeat",
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
    background: "brand.600",
  }
};

export const ButtonStyle = defineStyleConfig({
  variants: {
    transparent: transparentVariant,
    custom: customVariant,
    primary: primaryVariant,
  },
});
