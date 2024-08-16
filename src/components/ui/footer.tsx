import { Flex, Button, Container } from "@chakra-ui/react";
import { Account, Wallet, Help, Agenda, Scan } from "../icons";

type Route = {
  name: string;
  href: string;
  icon: React.FC;
};

const routes: Route[] = [
  { name: "Help", href: "/help", icon: Help },
  { name: "Agenda", href: "/agenda", icon: Agenda },
  { name: "Scan", href: "/scan", icon: Scan },
  { name: "Wallet", href: "/wallet", icon: Wallet },
  { name: "Me", href: "/me", icon: Account },
];

export function Footer() {
  return (
    <Container maxW={"container.sm"} p={0}>
      <footer>
        <Flex justifyContent="space-between" alignItems="center" as="nav">
          {routes.map((route, index) => (
            <Button as="a" key={index} href={route.href} variant="navigation">
              <route.icon />
              <span>{route.name}</span>
            </Button>
          ))}
        </Flex>
      </footer>
    </Container>
  );
}
