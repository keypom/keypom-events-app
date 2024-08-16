import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { Header } from "../../components/ui/header";
import { Footer } from "../../components/ui/footer";

export function Root() {
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
        backgroundImage: "url(/background.webp)",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "darken",
        transform: "scaleY(-1)",
        zIndex: 0,
      }}
    >
      <Flex
        maxH={{ base: "100dvh" }}
        direction={"column"}
        maxW={{ base: "100%", md: "380px" }}
        width={"100%"}
        marginX="auto"
        alignItems="center"
        justifyContent="center"
        zIndex={5}
        position="relative"
        flexGrow="1"
      >
        <Header />
        <Box
          role="main"
          flexGrow={1}
          maxW={{ base: "100%", md: "380px" }}
          maxH={{ base: "100dvh", md: "700px" }}
          width="100%"
          height="100%"
          position="relative"
          overflowY="auto"
          bg="black"
          zIndex={5}
          _before={{
            content: '""',
            position: "absolute",
            opacity: 0.5,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url(/background.webp)",
            backgroundSize: "cover",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
            zIndex: -1,
          }}
        >
          <Outlet />
        </Box>
        <Footer />
      </Flex>
    </Box>
  );
}
