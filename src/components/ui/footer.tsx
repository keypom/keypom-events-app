import { Box, Button, Flex } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

import { FOOTER_ITEMS, UNAUTHENTICATED_ROUTES } from "@/constants/common";
import { useEventCredentials } from "@/stores/event-credentials";

export type FooterItem = {
  name: string;
  href: string;
  icon: React.FC<{ width?: number; height?: number; color?: string }>;
};

export function Footer() {
  const { secretKey } = useEventCredentials();
  const { pathname } = useLocation();
  let isAuthenticated = false;

  if (!secretKey) {
    isAuthenticated = false;
  } else {
    isAuthenticated = true;
  }

  return (
    <Box p={0} width="100%" bg="bg.primary" borderBottomRadius={"md"}>
      <footer>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          as="nav"
          bg={"bg.primary"}
          borderBottomRadius={"md"}
        >
          {FOOTER_ITEMS.map((route, index) => {
            if (
              isAuthenticated ||
              UNAUTHENTICATED_ROUTES.some((path) => route.href.startsWith(path))
            ) {
              return (
                <Button
                  as={Link}
                  key={index}
                  to={route.href}
                  variant="primary"
                  backgroundColor={pathname === route.href ? "bg.primary" : ""}
                  color={pathname === route.href ? "brand.400" : "black"}
                >
                  <route.icon
                    width={24}
                    height={24}
                    color={
                      pathname === route.href
                        ? "var(--chakra-colors-brand-400)"
                        : "black"
                    }
                  />
                  <span>{route.name}</span>
                </Button>
              );
            }
          })}
        </Flex>
      </footer>
    </Box>
  );
}
