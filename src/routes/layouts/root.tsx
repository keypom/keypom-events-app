import { Box } from "@chakra-ui/react";

import { OfflineBanner } from "@/components/ui/offline-banner";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <Box
      minH="100dvh"
      width="100%"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url(/assets/background.webp)",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "darken",
        transform: "scaleY(-1)",
        zIndex: 0,
      }}
    >
      <OfflineBanner />
      <Outlet />
    </Box>
  );
}
