import { Flex, Button, Container } from "@chakra-ui/react";

type Route = {
  name: string;
  href: string;
};

const routes: Route[] = [
  { name: "Help", href: "/help" },
  { name: "Agenda", href: "/agenda" },
  { name: "Scan", href: "/scan" },
  { name: "Wallet", href: "/wallet" },
  { name: "Me", href: "/me" },
];

export function Footer() {
  return (
    <Container maxW={"container.sm"} p={0}>
      <footer>
        <Flex justifyContent="space-between" alignItems="center" as="nav">
          {routes.map((route, index) => (
            <Button as="a" key={index} href={route.href} variant="navigation">
              {route.name}
            </Button>
          ))}
        </Flex>
      </footer>
    </Container>
  );
}
