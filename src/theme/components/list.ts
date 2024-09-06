import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import { listAnatomy as parts } from "@chakra-ui/anatomy";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const variants = {
  custom: definePartsStyle(() => ({
    item: {
      color: "brand.400",
      fontFamily: "mono",
      textAlign: "left",
    },
  })),
};

export const ListStyle = defineMultiStyleConfig({ variants });
