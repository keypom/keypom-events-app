import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { Header } from "../../components/ui/header";
import { Footer } from "../../components/ui/footer";

export function Root() {
  return (
    <Box
      minH="100vh"
      width="100%"
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
        minHeight={"100vh"}
        direction={"column"}
        maxW={{ base: "100%", md: "380px" }}
        marginX="auto"
        alignItems="center"
        justifyContent="center"
        zIndex={5}
        position="relative"
      >
        <Header />
        <Box
          role="main"
          flexGrow={1}
          maxW={{ base: "100%", md: "380px" }}
          maxH={{ base: "100vh", md: "650px" }}
          backgroundImage="url(/background.webp)"
          backgroundSize="cover"
          backgroundPosition="top center"
          backgroundRepeat="no-repeat"
          width="100%"
          height="100%"
          position="relative"
          style={{ backgroundPositionY: "-40px" }}
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bg: "black",
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
