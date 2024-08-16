import { Box, Container, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { Header } from "../../components/ui/header";
import { Footer } from "../../components/ui/footer";

export function Root() {
  return (
    <Flex
      minHeight={"100vh"}
      direction={"column"}
      backgroundImage="url(/background.webp)"
      backgroundSize="cover"
      backgroundPosition="top center"
      backgroundRepeat="no-repeat"
      maxW={"container.sm"}
      marginX="auto"
    >
      <Header />
      <Box role="main" flexGrow={1}>
        <Container maxW={"container.sm"}>
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
}
