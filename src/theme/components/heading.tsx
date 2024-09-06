import { defineStyleConfig } from "@chakra-ui/react";

export const HeadingStyle = defineStyleConfig({
  variants: {
    "page-heading": {
      size: "lg",
      textTransform: "uppercase",
      fontWeight: "bold",
      textAlign: "center",
      color: "primary",
      height: "32px",
      letterSpacing: "-0.48px",
    },

    // Agenda
    "agenda.filterTitle": {
      fontSize: "md",
      fontFamily: "mono",
      color: "brand.600",
    },

    "agenda.filterCheckbox": {
      fontSize: "md",
      fontFamily: "mono",
      color: "secondary",
    },

    "agenda.eventTitle": {
      fontSize: "sm",
      fontFamily: "mono",
      fontWeight: 700,
      color: "primary",
    },

    "agenda.eventPresenter": {
      coolor: "brand.400",
      fontSize: "sm",
      fontWeight: 700,
    },

    "agenda.eventStage": {
      color: "brand.400",
      fontSize: "sm",
      fontWeight: 700,
    },

    // Alerts
    "alerts.title": {
      fontSize: "14px",
      fontFamily: "mono",
      color: "brand.400",
    },

    // Scan
    "scan.listHeading": {
      fontSize: "2xl",
      color: "primary",
      fontFamily: "mono",
    },
  },
});
