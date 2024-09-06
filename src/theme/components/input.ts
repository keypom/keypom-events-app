import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const customVariant = definePartsStyle({
  field: {
    fontFamily: "mono",
    color: "secondary",
    background: "tertiary",
    borderRadius: "md",
    fontWeight: "700",
    px: 4,
    py: 2,
    transition: "all 0.3s ease-in-out",
    "::placeholder": {
      color: "secondary",
      fontFamily: "mono",
      fontWeight: "700",
      fontSize: "16px",
      lineHeight: "14px",
      textTransform: "uppercase",
    },
  },
});

export const InputStyle = defineMultiStyleConfig({
  variants: {
    custom: customVariant,
  },
});
