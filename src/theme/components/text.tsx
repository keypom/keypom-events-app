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

    // Alerts
    "alerts.timeAgo": {
      fontSize: "10px",
      fontWeight: 700,
      color: "brand.600",
    },

    "alerts.description": {
      color: "primary",
      fontSize: "xs",
    },

    // Wallet
    "wallet.tokenSymbol": {
      fontFamily: "mono",
      fontSize: "2xl",
      fontWeight: "medium",
      color: "brand.400",
    },

    // Collectibles
    "collectibles.assetType": {
      color: "brand.400",
      fontSize: "10px",
      fontWeight: 700,
    },

    "collectibles.description": {
      fontSize: "xs",
      color: "primary",
      lineHeight: "120%",
    },

    // Journeys
    "journeys.cardDescription": {
      color: "brand.400",
      fontSize: "10px",
      fontWeight: 700,
    },

    "journeys.description": {
      fontSize: "xs",
      lineHeight: "120%",
    },
  },
});
