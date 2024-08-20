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

type Route = {
  name: string;
  href: string;
  icon: React.FC<{ width?: number; height?: number; color?: string }>;
};

const routes: Route[] = [
  { name: "Help", href: "/help", icon: HelpIcon },
  { name: "Agenda", href: "/agenda", icon: AgendaIcon },
  { name: "Scan", href: "/scan", icon: ScanIcon },
  { name: "Wallet", href: "/wallet", icon: WalletIcon },
  { name: "Me", href: "/me", icon: UserIcon },
];

export function Footer() {
  const { pathname } = useLocation();
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
          {routes.map((route, index) => (
            <Button
              as={Link}
              key={index}
              to={route.href}
              variant="navigation"
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
          ))}
        </Flex>
      </footer>
    </Box>
  );
}
