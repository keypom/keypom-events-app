import { Flex, Button, Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  HelpIcon,
  AgendaIcon,
  ScanIcon,
  WalletIcon,
  UserIcon,
} from "@/components/icons";
import { useEventCredentials } from "@/stores/event-credentials";

type Route = {
  name: string;
  href: string;
  icon: React.FC<{ width?: number; height?: number; color?: string }>;
  authRequired?: boolean;
};

const routes: Route[] = [
  { name: "Help", href: "/help", icon: HelpIcon, authRequired: false },
  { name: "Agenda", href: "/agenda", icon: AgendaIcon, authRequired: false },
  { name: "Scan", href: "/scan", icon: ScanIcon, authRequired: true },
  { name: "Wallet", href: "/wallet", icon: WalletIcon, authRequired: true },
  { name: "Me", href: "/me", icon: UserIcon, authRequired: true },
];

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
    <Box p={0} width="100%" bg="black" borderBottomRadius={"md"}>
      <footer>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          as="nav"
          bg={"black"}
          borderBottomRadius={"md"}
        >
          {routes.map((route, index) => {
            if (route.authRequired && !isAuthenticated) {
              return null;
            }
            return (
              <Button
                as={Link}
                key={index}
                to={route.href}
                variant="primary"
                backgroundColor={pathname === route.href ? "black" : ""}
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
          })}
        </Flex>
      </footer>
    </Box>
  );
}
