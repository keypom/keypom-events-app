import { defineStyleConfig } from "@chakra-ui/react";

export const TextStyle = defineStyleConfig({
  variants: {
    "page-description": {
      fontFamily: "mono",
      fontSize: "sm",
      fontWeight: 700,
      textAlign: "center",
      color: "brand.400",
    },

    // Agenda
    "agenda.eventDate": {
      color: "secondary",
      fontFamily: "mono",
      fontWeight: 700,
      fontSize: "16px",
      lineHeight: "14px",
      textTransform: "uppercase",
    },

    "agenda.eventTime": {
      fontFamily: "mono",
      color: "brand.400",
      fontSize: "sm",
      fontWeight: 700,
    },

    "agenda.eventDescription": {
      color: "brand.400",
      fontSize: "xs",
    },
  },
});
