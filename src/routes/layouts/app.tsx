import { Box, Flex } from "@chakra-ui/react";
import { Navigate, Outlet, useLocation, useNavigation } from "react-router-dom";

import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";

import { LoadingBox } from "@/components/ui/loading-box";
import { useEventCredentials } from "@/stores/event-credentials";
import { useEffect, useRef } from "react";

export default function AppLayout() {
  const { secretKey } = useEventCredentials();
  const { state } = useNavigation();

  const ref = useRef<HTMLDivElement>(null);

  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  if (
    !secretKey &&
    !["help", "agenda", "tickets"].includes(pathname.split("/")[1])
  ) {
    return <Navigate to="/help" replace={true} />;
  }

  return (
    <Flex
      maxH={{ base: "100dvh" }}
      direction={"column"}
      maxW={{ base: "100%", lg: "380px" }}
      width={"100%"}
      marginX="auto"
      alignItems="center"
      justifyContent="center"
      zIndex={5}
      position="relative"
      flexGrow="1"
      borderRadius={"md"}
    >
      <Header />
      <Box
        ref={ref}
        role="main"
        flexGrow={1}
        maxW={{ base: "100%", lg: "380px" }}
        maxH={{ base: "100dvh", lg: "700px" }}
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
          backgroundImage: "url(/assets/background.webp)",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      >
        {state === "loading" ? <LoadingBox /> : <Outlet />}
      </Box>
      <Footer />
    </Flex>
  );
}