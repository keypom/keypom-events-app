import { Flex, Link } from "@chakra-ui/react";

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
    <footer>
      <Flex m={4} justifyContent="center" alignItems="center" as="nav" gap={2}>
        {routes.map((route, index) => (
          <Link key={index} href={route.href} p={2}>
            {route.name}
          </Link>
        ))}
      </Flex>
    </footer>
  );
}
