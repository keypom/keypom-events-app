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

    // Claim
    "claim.description": {
      fontFamily: "mono",
      color: "brand.400",
      bg: "bg.primary",
      textAlign: "right",
      fontSize: "xl",
      textTransform: "uppercase",
    },

    // Header
    "header.text": {
      fontFamily: "mono",
      textAlign: "center",
      fontSize: ["xs", "sm"],
      fontWeight: "bold",
      lineHeight: "1rem",
      letterSpacing: "2.4px",
      color: "brand.800",
      flexShrink: 0,
    },

    // Offline Page
    "offline.heading": {
      fontFamily: "mono",
      color: "secondary",
      textAlign: "center",
      fontSize: "lg",
      fontWeight: "bold",
    },

    // Recieve
    "recieve.accountId": {
      fontFamily: "mono",
      color: "brand.400",
      textAlign: "center",
      noOfLines: 1,
    },

    // Welcome
    "welcome.username": {
      color: "brand.400",
      fontFamily: "mono",
      fontSize: "sm",
      textAlign: "center",
    },

    "welcome.ticketDetails": {
      color: "primary",
      fontFamily: "mono",
      fontSize: "sm",
      fontWeight: 400,
      textAlign: "center",
    },

    "welcome.ticketDeatilsSpan": {
      color: "brand.400",
      fontWeight: 400,
      size: { base: "lg", md: "xl" },
    },

    "welcome.ticketInfo": {
      color: "primary",
      fontFamily: "mono",
      fontWeight: 600,
      textAlign: "center",
    },
  },
});
