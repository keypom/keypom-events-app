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
    background: "brand.600",
  },
};

const secondaryVariant = {
  bg: "var(--chakra-colors-brand-400)",
  color: "black",
  borderRadius: "md",
  fontFamily: "mono",
  fontWeight: "bold",
  flex: "1 0 0",
  padding: "1.5rem 0",
  _hover: {
    bg: "var(--chakra-colors-brand-400)",
    color: "black",
  },
  _active: {
    bg: "var(--chakra-colors-brand-400)",
    color: "black",
  },
};

const outlineVariant = {
  ...FLEX_CENTER,
  bg: "transparent",
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

const alertLinkVariant = {
  ...FLEX_CENTER,
  borderRadius: "md",
  fontFamily: "mono",
  fontWeight: "bold",
  flex: "1 0 0",
  textAlign: "center",
  maxWidth: "max-content",
  padding: "4px 8px",
  width: "100%",
  fontSize: "xs",
  bg: "black",
  border: "1px solid var(--chakra-colors-brand-400)",
  color: "brand.400",
  gap: "8px",
};

const viewAllAlertsVariant = {
  ...primaryVariant,
  flexDirection: "row",
  padding: "4px 8px",
  maxWidth: "max-content",
  width: "100%",
  fontSize: "xs",
  gap: "8px",
};

const claimCongratsVariant = {
  width: "100%",
  bg: "bg.primary",
  fontFamily: "mono",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "48px",
  color: "primary",
  fontSize: "sm",
  borderRadius: 0,
  position: "relative",
  _hover: {
    background: "black",
    color: "white",
  },
  _active: {
    background: "black",
    color: "white",
  },
  _before: {
    content: '""',
    position: "absolute",
    width: "57px",
    height: "37px",
    left: -4,
    top: -4,
    zIndex: -1,
    background: "black",
  },
};

export const ButtonStyle = defineStyleConfig({
  variants: {
    transparent: transparentVariant,
    custom: customVariant,
    primary: primaryVariant,
    secondary: secondaryVariant,
    outline: outlineVariant,
    danger: dangerVariant,
    alertLink: alertLinkVariant,
    viewAllAlerts: viewAllAlertsVariant,
    claimCongrats: claimCongratsVariant,
  },
});
