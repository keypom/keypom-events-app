import { Box, Flex, Text } from "@chakra-ui/react";
import { Outlet, useNavigation } from "react-router-dom";

import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";

import { useEffect, useState, useRef } from "react";
import { LoadingBox } from "@/components/ui/loading-box";
import { useLocation } from "react-router-dom";

export function Root() {
  const { state } = useNavigation();
  const ref = useRef<HTMLDivElement>(null);

  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setOnlineStatus(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

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
        {/* Show if user is offline */}
        {!onlineStatus && (
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              fontFamily="mono"
              color="brand.400"
              textAlign="center"
              fontSize="lg"
              fontWeight="bold"
            >
              You are offline
            </Text>
          </Box>
        )}
        <Header />
        <Box
          ref={ref}
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
          {state === "loading" ? <LoadingBox /> : <Outlet />}
        </Box>
        <Footer />
      </Flex>
    </Box>
  );
}
