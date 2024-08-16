import { Flex, Button, Image, Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import Help from "../../assets/icon-help.svg";
import Agenda from "../../assets/icon-agenda.svg";
import Scan from "../../assets/icon-scan.svg";
import Wallet from "../../assets/icon-wallet.svg";
import Account from "../../assets/icon-account.svg";

type Route = {
  name: string;
  href: string;
  icon: string;
};

const routes: Route[] = [
  { name: "Help", href: "/help", icon: Help },
  { name: "Agenda", href: "/agenda", icon: Agenda },
  { name: "Scan", href: "/scan", icon: Scan },
  { name: "Wallet", href: "/wallet", icon: Wallet },
  { name: "Me", href: "/me", icon: Account },
];

export function Footer() {
  const { pathname } = useLocation();
  return (
    <Box p={0} width="100%" bg="black" borderBottomRadius={"md"}>
      <footer>
        <Flex justifyContent="space-between" alignItems="center" as="nav">
          {routes.map((route, index) => (
            <Button
              as="a"
              key={index}
              href={route.href}
              variant="navigation"
              backgroundColor={pathname === route.href ? "black" : ""}
              color={pathname === route.href ? "brand.400" : "black"}
            >
              <Image
                src={route.icon}
                filter={
                  pathname === route.href
                    ? "brightness(0) saturate(100%) invert(70%) sepia(28%) saturate(2698%) hue-rotate(106deg) brightness(99%) contrast(101%);"
                    : ""
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
