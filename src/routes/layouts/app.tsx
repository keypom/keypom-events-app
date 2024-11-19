import { Box, Flex } from "@chakra-ui/react";
import { Navigate, Outlet, useLocation, useNavigation } from "react-router-dom";

import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";

import { LoadingBox } from "@/components/ui/loading-box";
import {
  HIDDEN_FOOTER_ROUTES,
  NO_DIMENSION_CONSTRAINT_ROUTES,
  NO_HEADER_ROUTES,
  UNAUTHENTICATED_ROUTES,
} from "@/constants/common";
import { useEventCredentials } from "@/stores/event-credentials";
import { useEffect, useRef } from "react";
import { useConferenceData } from "@/hooks/useConferenceData";
import eventHelperInstance from "@/lib/event";

export default function AppLayout() {
  const { secretKey } = useEventCredentials();
  const { data, isLoading } = useConferenceData(secretKey);
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
    // no secret key
    !secretKey &&
    // not in unauthenticated routes
    !UNAUTHENTICATED_ROUTES.some((path) => pathname.startsWith(path))
  ) {
    return <Navigate to="/help" replace={true} />;
  }

  const isConferenceOver = !isLoading && true;
  if (
    isConferenceOver &&
    pathname !== "/offboarding" &&
    pathname !== "/me/admin"
  ) {
    eventHelperInstance.debugLog("Conference is over", "log");
    return <Navigate to="/offboarding" replace={true} />;
  }

  const shouldRenderFooter = !HIDDEN_FOOTER_ROUTES.some((path) =>
    pathname.startsWith(path),
  );

  const shouldConstrainDimensions = !NO_DIMENSION_CONSTRAINT_ROUTES.some(
    (path) => pathname.startsWith(path),
  );

  const shouldRenderHeader = !NO_HEADER_ROUTES.some((path) =>
    pathname.startsWith(path),
  );

  return (
    <Flex
      maxH={shouldConstrainDimensions ? { base: "100dvh" } : "100%"}
      direction={"column"}
      maxW={shouldConstrainDimensions ? { base: "100%", lg: "380px" } : "100%"}
      width={"100%"}
      marginX="auto"
      alignItems="center"
      justifyContent="center"
      zIndex={5}
      position="relative"
      flexGrow="1"
      borderRadius={"md"}
    >
      {shouldRenderHeader && <Header isConferenceOver={isConferenceOver} />}
      <Box
        ref={ref}
        role="main"
        flexGrow={1}
        maxW={
          shouldConstrainDimensions ? { base: "100%", lg: "380px" } : "100%"
        }
        maxH={
          shouldConstrainDimensions ? { base: "100dvh", lg: "700px" } : "100%"
        }
        width="100%"
        height="100%"
        position="relative"
        overflowY="auto"
        bg="bg.primary"
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
        {state === "loading" || isLoading ? <LoadingBox /> : <Outlet />}
      </Box>
      {shouldRenderFooter && <Footer />}
    </Flex>
  );
}
