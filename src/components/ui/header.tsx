import { Flex, Link } from "@chakra-ui/react";

export function Header() {
  return (
    <header>
      <Flex justifyContent="center" alignItems="center" as="nav" gap={2} m={4}>
        <Link href="/" textAlign="center">
          REDACTED
        </Link>
      </Flex>
    </header>
  );
}
